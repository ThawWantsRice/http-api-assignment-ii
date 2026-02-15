const users = {};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  // Headers contain our metadata. HEAD requests only get
  // this information back, so that the user can see what
  // a GET request to a given endpoint would return. Here
  // they would see what format of data (JSON) and how big
  // that data would be ('Content-Length')
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  // send response with json object
  response.writeHead(status, headers);

  // HEAD requests don't get a body back, just the metadata.
  // So if the user made one, we don't want to write the body.
  // 204 for "no content responses"
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

const getUsers = (request, response) => {
  // return 200 with message
  return respondJSON(request, response, 200, users);
};

const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required'
  };

  // grab name and age out of request.body for convenience
  // If either name or age do not exist in the request,
  // they will be set to undefined
  const { name, age } = request.body;

  if (!name || !age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  console.log(request.body);

  //204 = no content
  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name: name,
    };
  }

  //Updates go here Hint Hint Nudge Nudge API Project
  users[name].age = age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, 201, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
}

const notReal = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getUsers,
  addUser,
  notReal,
};