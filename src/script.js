const ul = document.querySelector('ul')
const newTaskBtn = document.getElementById("newTask")
let counter = document.getElementById('counter')
let taskCounter = 0
let ageSorting = 'newest'
let stateSorting = 'not-done'
let stateFiltering = ''
let videoFiltering = ''
let dateFiltering = ''
let importantFiltering = false
let liGlobal = []
const sortByAge = document.getElementById('sort-select')
const sortByState = document.getElementById('sort-select2')
const stateFilter = document.getElementById('filter-select')
const videoFilter = document.getElementById('filter-select2')
const sorter = document.querySelector('.sorter')
const filter = document.querySelector('.filter')
const sortBtn = document.querySelector('.sortBtn')
const filterBtn = document.querySelector('.filterBtn')
const datePicker = document.getElementById('taskInput4')
const dateFilter = document.getElementById('dateFilter')
const dateReset = document.getElementById('dateReset')
const filterCheckbox = document.getElementById('filter-checkbox')
datePicker.min = new Date().toISOString().split("T")[0];
datePicker.value = new Date().toISOString().split("T")[0];
filterCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
    importantFiltering = true
        filterList()
        sortList()
    } else {
        importantFiltering = false
        filterList()
        sortList()
    }
})
dateReset.addEventListener('click', (e) => {
    dateFilter.value = ''
    dateFiltering = ''
    filterList()
    sortList()
})
sortBtn.addEventListener('click',(e) => {
    if (filterBtn.classList.contains('on')) {
        e.target.classList.add('on')
        sorter.style.display = "block"
        filter.style.display = "none"
        filterBtn.classList.remove('on')
    }
})
filterBtn.addEventListener('click',(e) => {
    if (sortBtn.classList.contains('on')) {
        e.target.classList.add('on')
        filter.style.display = "block"
        sorter.style.display = "none"
        sortBtn.classList.remove('on')
    }
})
function getTheDate(str) {
    return str.split(', ')[1];
}
const filterList = () => {
    ul.innerHTML = ''
    liGlobal.map((e) => {
        if(videoFiltering === 'with-video' && !e.querySelector('iframe')) {
            return ''
        }
        if(videoFiltering === 'without-video' && e.querySelector('iframe')) {
            return ''
        }
        if(e.querySelector('#isDone').checked === true && stateFiltering === 'not-done') {
            return ''
        }
        if(e.querySelector('#isDone').checked === false && stateFiltering === 'done') {
            return ''
        }
        if (!e.querySelector('#dateSpan').innerHTML.includes("Important!") && importantFiltering === true) {
            return ''
        }
        if (dateFiltering) {
            if (new Date(dateFiltering).toLocaleDateString() !== new Date(getTheDate(e.querySelector('#dateSpan').textContent)).toLocaleDateString()) {
            return ''
            }
        }
        ul.appendChild(e)
    })
}
stateFilter.addEventListener('change', (e)=> {
    if (e.target.value === "not-done" || e.target.value === "done") {
        stateFiltering = e.target.value
        filterList()
        sortList()
    } else {
        stateFiltering = e.target.value
        filterList()
        sortList()
    }
})
videoFilter.addEventListener('change', (e)=> {
    if (e.target.value === "with-video" || e.target.value === "without-video") {
        videoFiltering = e.target.value
        filterList()
        sortList()
    } else {
        videoFiltering = e.target.value
        filterList()
        sortList()
    }
})
dateFilter.addEventListener('change', (e)=> {
        dateFiltering = e.target.value
        filterList()
        sortList()
})
sortByAge.addEventListener('change', (e)=> {
    if (e.target.value === "oldest" || e.target.value === "newest") {
        ageSorting = e.target.value
        filterList()
        sortList()
    }
})
sortByState.addEventListener('change', (e)=> {
    if (e.target.value === "done" || e.target.value === "not-done") {
        stateSorting = e.target.value
        filterList()
        sortList()
    }
})
const compareCheckBox = function (a, b) {
    if (a.querySelector('#isDone').checked === false && stateSorting === 'not-done') {
        return -1
    }
    if (a.querySelector('#isDone').checked === true && stateSorting === 'done') {
        return -1
    }
    if (a.querySelector('#isDone').checked === b.querySelector('#isDone').checked) {
        return -1
    }
    return 1
}
const compareAge = function (a, b) {
    if (a.id < b.id) {
        if (ageSorting === 'newest') {
            return -1;
        } else {
            return 1;
        }
    }
    if (a.id > b.id) {
        if (ageSorting === 'newest') {
            return 1;
        } else {
            return -1;
        }
    }
    return 0;
}
const checkImportant = function (a, b) {
    if (a.querySelector('#dateSpan').innerHTML.includes("Important!") && !b.querySelector('#dateSpan').innerHTML.includes("Important!")) {
        return -1
    } else if (!a.querySelector('#dateSpan').innerHTML.includes("Important!") && b.querySelector('#dateSpan').innerHTML.includes("Important!")) {
        return 1
    }
    return 0
}
const sortList = () => {
    const listElements = [...ul.querySelectorAll('li')]
    const sorted = listElements.sort(compareAge).sort(compareCheckBox).sort(checkImportant)
    ul.innerHTML = ''
    sorted.map((i) => {
        ul.appendChild(i)
    })
}
const changeCounter = (operation) => {
    if (operation === "+") {
        taskCounter++
        counter.textContent = `Tasks to Do Left: ${taskCounter}`
} else if (operation === "-") {
        taskCounter = taskCounter - 1
        counter.textContent = `Tasks to Do Left: ${taskCounter}`
    }
}
    const deleteContainer = document.querySelector('ul')
    deleteContainer.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === "button" || e.target.classList.contains("fa-trash-alt")) {
            let target = ''
            if (e.target.tagName.toLowerCase() === "i") {
                target = e.target.parentElement
            } else {
                target = e.target
            }
            fetch('/', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({deleteId: target.parentElement.id})
            })
            const index = liGlobal.indexOf(target.parentElement);
            if (index > -1) {
                liGlobal.splice(index, 1);
            }
            target.parentElement.remove()
            if (target.parentElement.querySelector('input').checked === false) {
                changeCounter('-')
            }
        } else if (e.target.id === "isDone") {
            fetch('/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postType: "isDone",id: e.target.parentElement.id, isDone: e.target.checked})
            })
            if (e.target.checked) {
                sortList()
                const arrowTarget = e.target.parentElement.querySelector('.fa-angle-down')
                changeCounter('-')
                e.target.parentElement.querySelector('p').classList.add('off')
                arrowTarget.parentElement.parentElement.querySelector('div').style.display = "none"
                const frame = e.target.parentElement.querySelector('iframe')
                if (e.target.parentElement.querySelector('div').querySelector('iframe')) {
                    frame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
                arrowTarget.classList.remove('fa-angle-down')
                arrowTarget.classList.add('fa-angle-up')
            } else if (!e.target.checked) {
                sortList()
                const arrowTarget = e.target.parentElement.querySelector('.fa-angle-up')
                changeCounter('+')
                e.target.parentElement.querySelector('p').classList.remove('off')
                arrowTarget.parentElement.parentElement.querySelector('div').style.display = "block"
                arrowTarget.classList.add('fa-angle-down')
                arrowTarget.classList.remove('fa-angle-up')
            }
        }
    })
function validURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}
function getSecondPart(str) {
    return str.split('=')[1];
}

const createNewListElement = (id, content, description,video, toBeDone, important, isDone) => {
    const li = document.createElement('li')
    li.id = id
    const p = document.createElement('p')
    p.textContent = content
    const div = document.createElement('div')
    const p2 = document.createElement('p')
    if (!toBeDone) {
        alert('Invalid date')
        return false
    }
    if (validURL(video)) {
        const vidPlayer = document.createElement('iframe')
        vidPlayer.src = `https://www.youtube.com/embed/${getSecondPart(video)}?version=3&enablejsapi=1`
        div.appendChild(vidPlayer)
    } else if (video === "") {
    } else if (validURL(video) === false) {
        alert('The URL is not valid!')
        return false
    }
    p2.textContent = description
    div.appendChild(p2)
    const btn = document.createElement('button')
    btn.classList.add('delete')
    btn.innerHTML = '<i class="far fa-trash-alt"></i>'
    const input = document.createElement('input')
    input.type = "checkbox"
    input.name = "isDone"
    input.id = "isDone"
    const span = document.createElement('span')
    const arrow = document.createElement('i')
    arrow.classList.add("fas", "fa-angle-down")
    if (isDone) {
        input.checked = true
        p.classList.add('off')
        arrow.classList.remove("fa-angle-down")
        arrow.classList.add("fa-angle-up")
        div.style.display = "none"
    }
    const br = document.createElement('br')
    const dateSpan = document.createElement('span')
    const dateObj = new Date(toBeDone)
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dateSpan.innerHTML = `Needs to be done till ${weekdays[dateObj.getDay()]}, ${dateObj.toLocaleDateString()}`
    if (important) {
        dateSpan.innerHTML = ` <b>Important!</b> Needs to be done till ${weekdays[dateObj.getDay()]}, ${dateObj.toLocaleDateString()}`
        li.classList.add('important')
    }
    dateSpan.id = "dateSpan"
    div.classList.add('clearfix')
    span.appendChild(arrow)
    li.appendChild(span)
    li.appendChild(p)
    li.appendChild(input)
    li.appendChild(btn)
    li.appendChild(br)
    li.appendChild(dateSpan)
    if (div.querySelector('iframe') || description) {
        li.appendChild(div)
    } else {
        li.removeChild(span)
        btn.style.right = "10px"
    }
    ul.appendChild(li)
    liGlobal.push(li)
    return true
}
fetch('/toDoList').then(data => data.json()).then(data => {
    data.tasks.map((i) => {
        createNewListElement(i.id, i.title, i.description,i.video,i.toBeDone, i.important, i.isDone)
    })
    sortList()
    taskCounter = [...document.querySelectorAll('li')].map((i) => {
        if (i.querySelector('#isDone').checked === true) {
            return  0
        } else {
            return  1
        }
    })
    taskCounter = taskCounter.reduce((a, b) => a + b, 0)
    counter.textContent = `Tasks to Do Left: ${taskCounter}`

}).catch(err => console.log(err))
newTaskBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const taskId = new Date().getTime().toString()
    if(document.getElementById("taskInput").value.length > 0) {
        if (createNewListElement(taskId, document.getElementById("taskInput").value, document.getElementById("taskInput2").value
            ,document.getElementById("taskInput3").value,document.getElementById("taskInput4").value, document.getElementById("taskInput5").checked, false)) {
            fetch('/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: {
                        id: taskId,
                        title: document.getElementById("taskInput").value,
                        description: document.getElementById("taskInput2").value,
                        video: document.getElementById("taskInput3").value,
                        toBeDone: document.getElementById("taskInput4").value,
                        important: document.getElementById("taskInput5").checked,
                        isDone: false
                    }
                })
            })
            filterList()
            sortList()
            changeCounter('+')
            document.getElementById("taskInput").value = ""
            document.getElementById("taskInput2").value = ""
            document.getElementById("taskInput3").value = ""
            document.getElementById("taskInput5").checked = false
        }
    } else {
        alert('You need to name a task')
    }
})

deleteContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-angle-down')) {
        e.target.parentElement.parentElement.querySelector('div').style.display = "none"
        e.target.classList.remove('fa-angle-down')
        e.target.classList.add('fa-angle-up')
        const frame = e.target.parentElement.parentElement.querySelector('iframe')
        frame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
    else if (e.target.classList.contains('fa-angle-up')) {
        e.target.parentElement.parentElement.querySelector('div').style.display = "block"
        e.target.classList.add('fa-angle-down')
        e.target.classList.remove('fa-angle-up')
    }
})




