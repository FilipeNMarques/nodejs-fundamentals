const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepoIds(request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid Repository id.'})
  }
  
  return next();
  
}

app.use('/repositories/:id', validateRepoIds);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.status(200).json(repository);
  
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  };
  repositories[repoIndex] = repository;

  if (repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'})
  }

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({eror: 'Repository not found.'})
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(repo => repo.id === id);

  if(!repo) {
      return resquest.status(400).json({ error: 'Project not found.' });
  }

  repo.likes++;

  return response.json(repo);

});

module.exports = app;
