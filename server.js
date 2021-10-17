const express = require('express');
const bodyParser = require('body-parser');
const {writeFile, readFile} = require('fs').promises
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.static('src'))
app.get('/',(req, res) => {
    res.render('index')
});
app.get('/toDoList', async (req,res) => {
    const toDo = await readFile('public/data.json', 'utf8');
    res.send(toDo)
})
app.post('/', async (req, res) => {
    console.log('post');
    if (req.body.task) {
        const toDo = await readFile('public/data.json', 'utf8');
        const toDoData = JSON.parse(toDo);
        toDoData.tasks.push(req.body.task)
        writeFile('public/data.json', JSON.stringify(toDoData));
    } else if (req.body.postType === "isDone") {
        const toDo = await readFile('public/data.json', 'utf8');
        const toDoData = JSON.parse(toDo);
        const taskToChange = toDoData.tasks.findIndex(task => task.id === req.body.id)
        toDoData.tasks[taskToChange].isDone = req.body.isDone
        writeFile('public/data.json', JSON.stringify(toDoData));
    }
});
app.delete('/', async (req, res) => {
    console.log('delete');
    console.log(req.body.deleteId);
    const toDo = await readFile('public/data.json', 'utf8');
    const toDoData = JSON.parse(toDo);
    toDoData.tasks.forEach(function(item, index, object) {
        if (item.id === req.body.deleteId) {
            object.splice(index, 1);
        };
    });
    writeFile('public/data.json', JSON.stringify(toDoData));
    res.end()
});

app.listen(port);