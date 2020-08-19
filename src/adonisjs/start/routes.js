'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const View = use('View')
const Helpers = use('Helpers')
const axios = use('axios')

Route.get('populate_modal', 'CaseController.populate_modal')

Route.get('/', ({ view }) =>
  view.render('index')
).as('index')

Route.get('institution-registration', async ({ view }) => {
  const pageTitle = 'Institution Registration'
  return view.render('registration.institution', { pageTitle })
})

// Those routes should be only accessible
// when you are not logged in
Route.group(() => {
  Route.get('signup', 'UserController.create').as('signup')
  Route.get('login', 'AuthController.create').as('login')

  Route.post('signup', 'UserController.signup').as('signup')
  Route.post('login', 'AuthController.login').as('login')
}).middleware(['guest'])

Route.get('author/:id', 'CaseController.getCase').as('author_edit')

Route.get('home', ({ view }) => {
  return view.render('author.home')
}).as('author_home')

Route.get('create', ({ view }) => {
  return view.render('author.create')
}).as('author_create')

Route.group(() => {
  Route.get('', ({ view }) => {
    return view.render('author.template-case')
  })

  Route.post('store', 'CaseController.store')
  Route.post('update', 'CaseController.update')
}).prefix('choose-template').as('author_template_case')

Route.get('drafts', ({ view }) => {
  return view.render('author.drafts')
}).as('cases_drafts')

/*
let harenaManagerUrl =
   Env.get("HARENA_MANAGER_URL", "http://localhost:3000/api/v1/");
*/

const Env = use('Env')

Route.get('infra/dcc-common-server-address.js', async ({ response, view }) => {
  const harena_manager_url = Env.get('HARENA_MANAGER_URL', 'http://127.0.0.1:10020')
  //  const harena_manager_url = "http://127.0.0.1:10020"
  const harena_manager_url_client = Env.get('HARENA_MANAGER_URL_CLIENT', 'http://127.0.0.1:10020')
  const harena_manager_api_version = Env.get('HARENA_MANAGER_API_VERSION', 'v1')
  //  const harena_manager_api_version = "v1"
  const harena_logger_url = Env.get('HARENA_LOGGER_URL', 'http://127.0.0.1:10030')
  //  const harena_logger_url = "http://127.0.0.1:10030"
  const harena_logger_api_version = Env.get('HARENA_LOGGER_API_VERSION', 'v1')
  //  const harena_logger_api_version = "v1"
  response.header('Content-type', 'application/javascript')
  return view.render('dcc-common-server-address',
    {
      harena_manager_url: harena_manager_url,
      harena_manager_url_client: harena_manager_url_client,
      harena_manager_api_version: harena_manager_api_version,
      harena_logger_url: harena_logger_url,
      harena_logger_api_version: harena_logger_api_version
    })
})

/*
Route.get('infra/dcc-common-server-address.js', async ({response, view}) =>{
    const harena_manager_url = Env.get('HARENA_MANAGER_URL', 'http://127.0.0.1:3000/api/v1');
    response.header('Content-type', 'application/javascript');
    return view.render('dcc-common-server-address',{ "harena_manager_url" : harena_manager_url });
});
*/

/*
Route.on("/author/js/dcc-author-server-address.js")
     .render("dcc-author-server-address", {harena_manager_url: harenaManagerUrl});
*/

/*
Route.on("/", async ({response, view}) => {
   return response.header("Content-type", "application/javascript").send(
      view.render("dcc-author-server-address", {harena_manager_url: harenaManagerUrl}));
});
*/

/*
Route.get("/themes", ({view}) => {
   return view.render("themes.classic.knot");
});
*/

/*
const fs = use("fs");
const Helpers = use("Helpers");
const readFile = Helpers.promisify(fs.readFile);

Route.get("/themes", async ({response}) => {
  return await readFile("resources/themes/classic/knot.html");
});
*/

/*
Route.get("/images/45293/doctor.png", async ({response}) => {
  return await readFile("resources/images/45293/doctor.png");
});
*/

/*
Route.get("/resources/images/45293/doctor.png", async ({response}) => {
  return response.redirect("doctor.png");
});
*/
