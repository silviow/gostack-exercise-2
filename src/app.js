const express = require("express");
const { uuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
    res.json(repositories);
});

app.post("/repositories", (req, res) => {
    const { title, url, techs } = req.body;

    if (!title || !url) {
        return res.status(400).json({ error: 'A project must contain "title" and "url".' })
    }

    const project = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(project);

    return res.json(project);
});

app.put("/repositories/:id", (req, res) => {
    const { id } = req.params;
    const { title, url, techs } = req.body;
    
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    
    if (repositoryIndex === -1) {
        return res.status(400).json({ error: 'Repository does not exists.' })
    }

    const newRepository = {
        id,
        title,
        url,
        techs,
        likes: repositories[repositoryIndex].likes,
    };

    repositories[repositoryIndex] = newRepository;

    return res.json(newRepository);
});

app.delete("/repositories/:id", (req, res) => {
    const repositoryIndex = repositories.findIndex(repository => repository.id === req.params.id);

    if (repositoryIndex === -1) {
        return res.status(400).json({ error: 'Repository does not exists.' })
    }

    repositories.splice(repositoryIndex, 1);

    return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
    const repositoryIndex = repositories.findIndex(repository => repository.id === req.params.id);

    if (repositoryIndex === -1) {
        return res.status(400).json({ error: 'Repository does not exists.' })
    }

    repositories[repositoryIndex].likes++;

    return res.json(repositories[repositoryIndex]);
});

module.exports = app;
