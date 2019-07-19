<a name="3.0.7"></a>
## [3.0.7](https://github.com/adonisjs/adonis-auth/compare/v3.0.6...v3.0.7) (2018-10-01)


### Bug Fixes

* **schemes:** add loginIfCan method to all schemes ([3de0a82](https://github.com/adonisjs/adonis-auth/commit/3de0a82))


### Features

* **api-scheme:** allow auth header type to be `token` alongside with `bearer` ([56621d0](https://github.com/adonisjs/adonis-auth/commit/56621d0))
* **middleware:** add AllowGuestOnly ([#125](https://github.com/adonisjs/adonis-auth/issues/125)) ([76e918b](https://github.com/adonisjs/adonis-auth/commit/76e918b))



<a name="3.0.6"></a>
## [3.0.6](https://github.com/adonisjs/adonis-auth/compare/v3.0.5...v3.0.6) (2018-07-15)


### Bug Fixes

* **jwt:** use option jwtOptions in generateForRefreshToken ([#107](https://github.com/adonisjs/adonis-auth/issues/107)) ([019dfbf](https://github.com/adonisjs/adonis-auth/commit/019dfbf))
* **session:** use cookie options for rememberme token ([4cdaf87](https://github.com/adonisjs/adonis-auth/commit/4cdaf87)), closes [#117](https://github.com/adonisjs/adonis-auth/issues/117)
* ensure uid in always a string in validate calls ([fb07728](https://github.com/adonisjs/adonis-auth/commit/fb07728)), closes [#118](https://github.com/adonisjs/adonis-auth/issues/118)



<a name="3.0.5"></a>
## [3.0.5](https://github.com/adonisjs/adonis-auth/compare/v3.0.4...v3.0.5) (2018-03-30)


### Features

* **apischeme:** allow clientLogin to accept user instance ([97ba27d](https://github.com/adonisjs/adonis-auth/commit/97ba27d))



<a name="3.0.4"></a>
## [3.0.4](https://github.com/adonisjs/adonis-auth/compare/v3.0.3...v3.0.4) (2018-03-18)



<a name="3.0.3"></a>
## [3.0.3](https://github.com/adonisjs/adonis-auth/compare/v3.0.1...v3.0.3) (2018-03-16)


### Bug Fixes

* **databaseSerializer:** fix serializer after knex upgrade ([d88d2a8](https://github.com/adonisjs/adonis-auth/commit/d88d2a8))
* **package:** add comma ([b9a456f](https://github.com/adonisjs/adonis-auth/commit/b9a456f))
* **provider:** use correct namespace for WsContext ([d28698c](https://github.com/adonisjs/adonis-auth/commit/d28698c))


### Features

* **basicauth:** allow basic auth string via request body ([0466ed8](https://github.com/adonisjs/adonis-auth/commit/0466ed8))
* **middleware:** add methods on middleware to be used with Websocket ([1afb942](https://github.com/adonisjs/adonis-auth/commit/1afb942))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/adonisjs/adonis-auth/compare/v3.0.1...v3.0.2) (2018-02-16)


### Bug Fixes

* **instructions:** do not log errors ([793bc62](https://github.com/adonisjs/adonis-auth/commit/793bc62))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/adonisjs/adonis-auth/compare/v3.0.0...v3.0.1) (2018-02-07)


### Bug Fixes

* **serializer:** db serializer use columnize method ([8c22f97](https://github.com/adonisjs/adonis-auth/commit/8c22f97))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/adonisjs/adonis-auth/compare/v2.0.11...v3.0.0) (2018-01-31)


### Bug Fixes

* **auth:** authorization header bearer is not case insensitive ([2c5ab9e](https://github.com/adonisjs/adonis-auth/commit/2c5ab9e))
* **config:** remove deprecated self call ([#90](https://github.com/adonisjs/adonis-auth/issues/90)) ([30fd632](https://github.com/adonisjs/adonis-auth/commit/30fd632))


### Features

* **jwt,api:** add revokeToken(s) method ([5e5757d](https://github.com/adonisjs/adonis-auth/commit/5e5757d))



<a name="2.0.11"></a>
## [2.0.11](https://github.com/adonisjs/adonis-auth/compare/v2.0.10...v2.0.11) (2018-01-12)


### Bug Fixes

* **auth middleware:** main instance of auth should point the valid user ([c0a0138](https://github.com/adonisjs/adonis-auth/commit/c0a0138))
* **auth middleware:** use default scheme in case of no runtime scheme ([54a5de1](https://github.com/adonisjs/adonis-auth/commit/54a5de1))
* **exceptions:** exceptions should use fields names of current authenticator ([9e53837](https://github.com/adonisjs/adonis-auth/commit/9e53837)), closes [#75](https://github.com/adonisjs/adonis-auth/issues/75)
* **tokenschema:** generated tokens are bigger after encryption ([f85a4d2](https://github.com/adonisjs/adonis-auth/commit/f85a4d2)), closes [#77](https://github.com/adonisjs/adonis-auth/issues/77)


### Features

* **jwt:** add login() method to jwt scheme ([#72](https://github.com/adonisjs/adonis-auth/issues/72)) ([0466109](https://github.com/adonisjs/adonis-auth/commit/0466109))



<a name="2.0.10"></a>
## [2.0.10](https://github.com/adonisjs/adonis-auth/compare/v2.0.9...v2.0.10) (2017-10-31)


### Bug Fixes

* **view.auth:** share auth user with view from middleware ([3b4b081](https://github.com/adonisjs/adonis-auth/commit/3b4b081))



<a name="2.0.9"></a>
## [2.0.9](https://github.com/adonisjs/adonis-auth/compare/v2.0.8...v2.0.9) (2017-10-31)


### Bug Fixes

* **vow:trait:** throw exception when session trait is before auth ([cb462e2](https://github.com/adonisjs/adonis-auth/commit/cb462e2))



<a name="2.0.8"></a>
## [2.0.8](https://github.com/adonisjs/adonis-auth/compare/v2.0.7...v2.0.8) (2017-10-29)


### Bug Fixes

* **package:** update basic-auth to version 2.0.0 (#59) ([244839b](https://github.com/adonisjs/adonis-auth/commit/244839b))


### Features

* **auth:** add loggedIn tag and share auth with view ([3382c8e](https://github.com/adonisjs/adonis-auth/commit/3382c8e))



<a name="2.0.7"></a>
## [2.0.7](https://github.com/adonisjs/adonis-auth/compare/v2.0.6...v2.0.7) (2017-10-03)


### Bug Fixes

* **middleware:** handle case when middleware scheme is not an array ([5364f40](https://github.com/adonisjs/adonis-auth/commit/5364f40)), closes [#61](https://github.com/adonisjs/adonis-auth/issues/61)
* **package:** update debug to version 3.0.0 (#54) ([ef300bf](https://github.com/adonisjs/adonis-auth/commit/ef300bf))
* **package:** update jsonwebtoken to version 8.0.0 (#57) ([8c4497b](https://github.com/adonisjs/adonis-auth/commit/8c4497b))



<a name="2.0.6"></a>
## [2.0.6](https://github.com/adonisjs/adonis-auth/compare/v2.0.5...v2.0.6) (2017-09-06)


### Bug Fixes

* **config:** add table column and api config ([d038205](https://github.com/adonisjs/adonis-auth/commit/d038205))


### Features

* **client:** add auth client for vow ([e18b02e](https://github.com/adonisjs/adonis-auth/commit/e18b02e))
* **client:** add clientLogin method on api scheme ([b6e3767](https://github.com/adonisjs/adonis-auth/commit/b6e3767))



<a name="2.0.5"></a>
## [2.0.5](https://github.com/adonisjs/adonis-auth/compare/v2.0.4...v2.0.5) (2017-08-22)



<a name="2.0.4"></a>
## [2.0.4](https://github.com/adonisjs/adonis-auth/compare/v2.0.3...v2.0.4) (2017-08-22)


### Bug Fixes

* **jwt:** jwt remove password when attaching user ([542d331](https://github.com/adonisjs/adonis-auth/commit/542d331))


### Features

* **jwt,api:** add listTokens method ([1932449](https://github.com/adonisjs/adonis-auth/commit/1932449))
* **tokens:** encrypt api and jwt refresh tokens ([57d5650](https://github.com/adonisjs/adonis-auth/commit/57d5650))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/adonisjs/adonis-auth/compare/v2.0.2...v2.0.3) (2017-08-16)


### Features

* **middleware:** add auth middleware ([50e7346](https://github.com/adonisjs/adonis-auth/commit/50e7346))
* **schemes:** add api tokens scheme ([b4c98d7](https://github.com/adonisjs/adonis-auth/commit/b4c98d7))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/adonisjs/adonis-auth/compare/v2.0.1...v2.0.2) (2017-08-08)


### Bug Fixes

* **test:** add dummy provider for Exceptions ([f308199](https://github.com/adonisjs/adonis-auth/commit/f308199))


### Features

* **exceptions:** add handlers for exceptions ([70ac097](https://github.com/adonisjs/adonis-auth/commit/70ac097))
* **schemes:** expose base scheme and few config properties ([60b9e18](https://github.com/adonisjs/adonis-auth/commit/60b9e18))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/adonisjs/adonis-auth/compare/v2.0.0...v2.0.1) (2017-08-05)


### Bug Fixes

* fix typo errors ([4a600d3](https://github.com/adonisjs/adonis-auth/commit/4a600d3))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/adonisjs/adonis-auth/compare/v1.0.7...v2.0.0) (2017-08-04)


### Bug Fixes

* **auth:** get cookie expiry as a date ([5bb56b8](https://github.com/adonisjs/adonis-auth/commit/5bb56b8))
* **package:** update ms to version 1.0.0 (#37) ([87fd5a9](https://github.com/adonisjs/adonis-auth/commit/87fd5a9))


### Features

* **auth:** add auth class ([23b749e](https://github.com/adonisjs/adonis-auth/commit/23b749e))
* **exceptions:** use generic-exceptions module ([c7026f5](https://github.com/adonisjs/adonis-auth/commit/c7026f5))
* **instructions:** added instructions files ([23d4532](https://github.com/adonisjs/adonis-auth/commit/23d4532))
* **jwt:** add jwt scheme ([be074d6](https://github.com/adonisjs/adonis-auth/commit/be074d6))
* **manager:** add auth manager ([9132fb9](https://github.com/adonisjs/adonis-auth/commit/9132fb9))
* **middleware:** add authinit middleware ([b255540](https://github.com/adonisjs/adonis-auth/commit/b255540))
* **provider:** add provider ([4ff5650](https://github.com/adonisjs/adonis-auth/commit/4ff5650))
* **scheme:** implement basic auth scheme ([2a39cf2](https://github.com/adonisjs/adonis-auth/commit/2a39cf2))
* **scheme:** implement session scheme ([e2be7d3](https://github.com/adonisjs/adonis-auth/commit/e2be7d3))
* **serializer:** add methods to support tokens ([7c4c28d](https://github.com/adonisjs/adonis-auth/commit/7c4c28d))
* **serializer:** implement database serializer ([533a2fb](https://github.com/adonisjs/adonis-auth/commit/533a2fb))
* **session:** add loginIfCan method ([bdc0274](https://github.com/adonisjs/adonis-auth/commit/bdc0274))


### Reverts

* **provider:** do not register middleware ([d203a97](https://github.com/adonisjs/adonis-auth/commit/d203a97))



<a name="1.0.7"></a>
## [1.0.7](https://github.com/adonisjs/adonis-auth/compare/v1.0.6...v1.0.7) (2017-03-27)


### Bug Fixes

* **middleware:** use request.viewInstance over view global ([00d4c20](https://github.com/adonisjs/adonis-auth/commit/00d4c20))



<a name="1.0.6"></a>
## [1.0.6](https://github.com/adonisjs/adonis-auth/compare/v1.0.5...v1.0.6) (2017-02-17)


### Bug Fixes

* **middleware:** use authenticator instance for check and getUser ([c4493e7](https://github.com/adonisjs/adonis-auth/commit/c4493e7)), closes [#32](https://github.com/adonisjs/adonis-auth/issues/32)



<a name="1.0.5"></a>
## [1.0.5](https://github.com/adonisjs/adonis-auth/compare/v1.0.4...v1.0.5) (2016-12-12)


### Bug Fixes

* **api:tokens:** fix revokeTokens ([c012936](https://github.com/adonisjs/adonis-auth/commit/c012936)), closes [#24](https://github.com/adonisjs/adonis-auth/issues/24)
* **command:** fix typo (#26) ([3409fd2](https://github.com/adonisjs/adonis-auth/commit/3409fd2)), closes [#26](https://github.com/adonisjs/adonis-auth/issues/26)


### Features

* **basic:** add support for query string ([a177aa3](https://github.com/adonisjs/adonis-auth/commit/a177aa3))
* **jwt:** add option for passing custom payload ([2e413fe](https://github.com/adonisjs/adonis-auth/commit/2e413fe)), closes [#14](https://github.com/adonisjs/adonis-auth/issues/14)
* **schemes:jwt:** add custom jwt payload functionality ([a542fc4](https://github.com/adonisjs/adonis-auth/commit/a542fc4))
* **socket:** add method to support websocket ([43f0126](https://github.com/adonisjs/adonis-auth/commit/43f0126))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/adonisjs/adonis-auth/compare/v1.0.3...v1.0.4) (2016-09-26)


### Features

* **jwt:** add validate and attempt methods ([46b8bb7](https://github.com/adonisjs/adonis-auth/commit/46b8bb7)), closes [#18](https://github.com/adonisjs/adonis-auth/issues/18)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/adonisjs/adonis-auth/compare/v1.0.2...v1.0.3) (2016-09-13)

### Bug Fixes

* **migrations** keep exports and class name same

<a name="1.0.2"></a>
## 1.0.2 (2016-08-26)


* Update adonis-fold as peer dependency

<a name="1.0.1"></a>
## 1.0.1 (2016-08-26)


* Update adonis-fold


<a name="1.0.0"></a>
# 1.0.0 (2016-06-26)


### Bug Fixes

* **case:** the folder name should be lowercase([3bfb241](https://github.com/adonisjs/adonis-auth/commit/3bfb241))
* **middleware:authinit:** inject view when binding to IoC container([56de662](https://github.com/adonisjs/adonis-auth/commit/56de662))
* **middleware:authinit:** make sure currentUser is accessible to all views and requests([3065580](https://github.com/adonisjs/adonis-auth/commit/3065580))
* **package:** remove adonis-fold old dependency and fix package name([b59f754](https://github.com/adonisjs/adonis-auth/commit/b59f754))
* **serializer:database:** fix typo errors([6fb2b9f](https://github.com/adonisjs/adonis-auth/commit/6fb2b9f))


### Features

* **authenticator:api:** add api authenticator([3c9438d](https://github.com/adonisjs/adonis-auth/commit/3c9438d))
* **authenticator:basicAuth:** implement basic auth authenticator([6b92bea](https://github.com/adonisjs/adonis-auth/commit/6b92bea))
* **authenticator:jwt:** implement jwt authenticator([7044e93](https://github.com/adonisjs/adonis-auth/commit/7044e93))
* **authenticator:session:** implement session authenticator and it's tests([ac0cd62](https://github.com/adonisjs/adonis-auth/commit/ac0cd62))
* **authmanager:** bind auth manager to the Ioc container([53990e7](https://github.com/adonisjs/adonis-auth/commit/53990e7))
* **commands:** add command to create migrations and models([eda99f1](https://github.com/adonisjs/adonis-auth/commit/eda99f1))
* **commands:** add command to create migrations and models([ba80fe1](https://github.com/adonisjs/adonis-auth/commit/ba80fe1))
* **middleware:** add required middleware([831a803](https://github.com/adonisjs/adonis-auth/commit/831a803))
* **package:** add coveralls hook([1e53c45](https://github.com/adonisjs/adonis-auth/commit/1e53c45))
* **serializer:** add Lucid serializer([8c53318](https://github.com/adonisjs/adonis-auth/commit/8c53318))
* **serializer:** initiate Database serializer([eadb70d](https://github.com/adonisjs/adonis-auth/commit/eadb70d))
* **serializer:database:** add database serializer([6d9313e](https://github.com/adonisjs/adonis-auth/commit/6d9313e))
* **serializer:lucid:** add methods to retrieve tokens([908d8dc](https://github.com/adonisjs/adonis-auth/commit/908d8dc))
* **util:** add support for date diff([a489109](https://github.com/adonisjs/adonis-auth/commit/a489109))



