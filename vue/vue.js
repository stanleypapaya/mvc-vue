fakeData()

function Model(options){
  this.data = options.data
  this.resource = options.resource
}
Model.prototype.fetch = function(id){
  return axios.get(`/${this.resource}s/${id}`).then((response) => {
      this.data = response.data
      console.log(this.data)
      return response
    })
}
Model.prototype.update = function(data){
  let id = this.data.id
    
    return axios.put(`/${this.resource}s/${id}`, data).then((response) => {
      this.data = response.data 
      console.log('response')
      console.log(response)
      return response
    })
}


// ----------  上面是 MVC 构造函数，下面是实例对象
let model = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  resource: 'book'
})

let view = new Vue({
  el: '#app',
  data: {
    book:{
      name: '未命名',
      number: 0,
      id: ''
    },
    n: 1
  },
  template: `
  <div>
    <div>
    书名：《{{book.name}}》
    数量：<span id=number>{{book.number}}</span>
    </div>
    <div>
       <input v-model="n" />
      N 的值是 {{n}}
    </div>
    <div>
      <button v-on:click="addOne">加N</button>
      <button v-on:click="minusOne">减N</button>
      <button v-on:click="reset">归零</button>
    </div>
  </div>
  `,
  created(){
    model.fetch(1).then(()=>{
      this.book = model.data
    })
  },
  methods:{
    addOne() {
      model.update({
        number: this.book.number + (this.n-0)
      }).then(() => {
        this.view.book = this.model.data
      })

    },
    minusOne() {
      model.update({
        number: this.book.number - (this.n-0)
      }).then(() => {
        this.view.book = this.model.data
      })
    },
    reset() {
      model.update({
        number: 0
      }).then(() => {
        this.view.book = this.model.data
      })
    },
  }
})