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
const Route = use("Route");

Route.on("/").render("welcome");

/*
Route.get("/themes", ({view}) => {
   return view.render("themes.classic.knot");
});
*/

const fs = use("fs");
const Helpers = use("Helpers");
const readFile = Helpers.promisify(fs.readFile);

/*
Route.get("/themes", async ({response}) => {
  return await readFile("resources/themes/classic/knot.html")
});
*/

/*
Route.get("/images/45293/doctor.png", async ({response}) => {
  return await readFile("resources/images/45293/doctor.png");
});
*/

Route.get("/resources/images/45293/doctor.png", async ({response}) => {
  return response.redirect("doctor.png");
});
