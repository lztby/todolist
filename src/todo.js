//自己定义一个log函数
let log = function () {
    console.log.apply(console, arguments)
}

// 文档对象模型Document引用的
// querySelector()方法返回文档中与指定选择器或选择器组匹配的第一个 html元素Element。
//  如果找不到匹配项，则返回null。
let e = function (selector) {
    return document.querySelector(selector)
}

//得到当前的时间
let now = function () {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let hour = d.getHours()
    let minute = d.getMinutes()
    let second = d.getSeconds()
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}


let todoContainer = e('#id-div-container')
let date = now()

//绑定事件
let addButton = e('#id-button-add')
addButton.addEventListener('click', function () {
    let todoInput = e('#id-input-todo')
    let todo = todoInput.value
    log('addbutton' + date)
    inserTodo(todo, false, date)
    saveTodos()

})


//事件委托:就是把一个元素响应事件（click、keydown......）的函数委托到另一个元素；
// event.target 属性可以用来实现事件委托 (event delegation)。

todoContainer.addEventListener('click', function (event) {
    let target = event.target
    if (target.classList.contains('todo-done')) {
        // target.parentElement 用来获取按钮的父节点
        // 给 todo div 开关一个状态 class
        let todoDiv = target.parentElement
        toggleClass(todoDiv, 'done')
        saveTodos()

    } else if (target.classList.contains('todo-delete')) {
        let todoDiv = target.parentElement
        todoDiv.remove()
        saveTodos()
    }

})

//插入
let inserTodo = function (todo, statu, date) {
    let t = templateTodo(todo, statu, date)
    todoContainer.insertAdjacentHTML('beforeend', t)
    //insertAdjacentHTML() 将指定的文本解析为HTML或XML，并将结果节点插入到DOM树中的指定位置。
    //它不会重新解析它正在使用的元素，因此它不会破坏元素内的现有元素。

}
//插入模板
let templateTodo = function (todo, statu, date) {
    log(date)
    let status = ''
    if (statu) {
        status = 'done'
    }
    let t = `
        <div class='todo-cell ${status}'>
            <span class="todo-time" >${date}</span>
            <button class="todo-done">完成</button>
            <button class="todo-delete">删除</button>
            <span class="todo-content" contenteditable="true">${todo}</span>
        </div>`
    return t;
}


// 这个函数用来开关一个元素的某个 class
let toggleClass = function (element, className) {
    // 检查元素是否拥有某个 class
    if (element.classList.contains(className)) {
        // 拥有则删除之
        element.classList.remove(className)
    } else {
        // 没有则加上
        element.classList.add(className)
    }
}

//用 localStorage 存储数据

//使用JSON 序列化后，就可以把 todo 存入浏览器的 localStorage

//定义一个函数，用于把数组写入 localStorage
let save = function (array) {
    let s = JSON.stringify(array)//数组转字符串
    log('序列化后的字符串', typeof s, s)
    localStorage.todos = s
}

//读取localStorage中的数据并解析返回

let load = function () {
    let s = localStorage.todos
    let a = JSON.parse(s)
    log('反序列化后的数组', typeof a, a)
    return a    //字符串转数组
}


//把页面上所有的 todo 用save 保存
let saveTodos = function () {
    //选中所有的class为todo-content
    let contents = document.querySelectorAll('.todo-content')
    let times = document.querySelectorAll('.todo-time')
    let todos = []
    for (let i = 0; i < contents.length; i++) {
        let element = contents[i]
        let element_time = times[i]
        let statu = element.parentElement.classList.contains('done')
        let todo = {
            done: statu,
            content: element.innerHTML,
            time: element_time.innerHTML,
        }
        //添加到数组中
        todos.push(todo)
    }
    save(todos)
}

let loadTodos = function () {
    let todos = load()
    //每个div都插入
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        inserTodo(todo.content, todo.done, todo.time)
    }
}

//刷新自动装载
loadTodos()

//添加时间
now()