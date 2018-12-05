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

function View({element, template}){
  this.element = element
  this.template = template
}
View.prototype.render = function(data){
  let html = this.template
  for(let key in data){
    html = html.replace(`__${key}__`, data[key])
  }
  $(this.element).html(html)
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

let view = new View({
  element: '#app',
  template: `
    <div>
    书名：《__name__》
    数量：<span id=number>__number__</span>
    </div>
    <div>
      <button id="addOne">加1</button>
      <button id="minusOne">减1</button>
      <button id="reset">归零</button>
    </div>
  `
})

let controller = {
  init(options) {
    
    let view = options.view
    let model = options.model
    this.view = view
    this.model = model
    
    this.view.render(this.model.data)
    
    this.bindEvents()
    this.model.fetch(1).then(() => {
      console.log('this.model.data')
            console.log(this.model.data)
      this.view.render(this.model.data)
    })
    
  },
  addOne() {
    var oldNumber = $('#number').text() // string
    var newNumber = oldNumber - 0 + 1
    this.model.update({
      number: newNumber
    }).then(() => {
      this.view.render(this.model.data)
    })

  },
  minusOne() {
    var oldNumber = $('#number').text() // string
    var newNumber = oldNumber - 0 - 1
    this.model.update({
      number: newNumber
    }).then(() => {
      this.view.render(this.model.data)
    })
  },
  reset() {
    this.model.update({
      number: 0
    }).then(() => {
      this.view.render(this.model.data)
    })
  },
  bindEvents() {
    // this === controller
    $(this.view.element).on('click', '#addOne', this.addOne.bind(this))
    $(this.view.element).on('click', '#minusOne', this.minusOne.bind(this))
    $(this.view.element).on('click', '#reset', this.reset.bind(this))
  }
}

controller.init({view:view, model: model})





// 不要看
function fakeData() {
  let book = {
    name: 'JavaScript 高级程序设计',
    number: 2,
    id: 1
  }
  axios.interceptors.response.use(function(response) {
    let {
      config: {
        method, url, data
      }
    } = response

    if (url === '/books/1' && method === 'get') {
      response.data = book
    } else if (url === '/books/1' && method === 'put') {
      data = JSON.parse(data)
      Object.assign(book, data)
      response.data = book
    }
    return response
  })
}