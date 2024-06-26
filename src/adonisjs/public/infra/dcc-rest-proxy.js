(function () {

  DCC.component(
    'harena-login',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/auth/login': {
            'post': {
              operationId: 'login',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'email',
                 in: 'query'},
                {name: 'password',
                 in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-logout',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/auth/logout': {
            'post': {
              operationId: 'logout',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-login-event',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/auth/login_event': {
            'post': {
              operationId: 'login',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'eventId',
                 in: 'query'},
                {name: 'username',
                 in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-change-password',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/user/password': {
            'put': {
              operationId: 'change-password',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'oldPassword',
                 in: 'query'},
                {name: 'newPassword',
                 in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-create-case',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/case': {
            'post': {
              operationId: 'create-case',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'title',
                 in: 'query'},
                {name: 'source',
                 in: 'query'},
                {name: 'description',
                 in: 'query'},
                {name: 'language',
                 in: 'query'},
                {name: 'domain',
                 in: 'query'},
                {name: 'specialty',
                 in: 'query'},
                {name: 'keywords',
                 in: 'query'},
                {name: 'creationDate',
                 in: 'query'},
                {name: 'institution',
                 in: 'query'},
                {name: 'complexity',
                 in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-case',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'caseId': new URL(document.location).searchParams.get('id')
      },
      oas: {
        paths: {
          '{url-manager}/case': {
            'get': {
              operationId: 'case',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'caseId',
                  in: 'query'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-category-list',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/category/list': {
            'get': {
              operationId: 'categories',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-category-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'categoryId': new URL(document.location).searchParams.get('id'),
        'clearance': new URL(document.location).searchParams.get('clearance'),
        'fProperty': new URL(document.location).searchParams.get('prop'),
        'fInstitution': new URL(document.location).searchParams.get('fInstitution'),
        'fUserType': new URL(document.location).searchParams.get('fUserType'),
        'fSpecialty': new URL(document.location).searchParams.get('fSpecialty'),
        'fPropertyValue': new URL(document.location).searchParams.get('fPropertyValue'),
        'fSearchStr': new URL(document.location).searchParams.get('fSearchStr'),
        'page': new URL(document.location).searchParams.get('page'),
        'nItems': new URL(document.location).searchParams.get('limit'),
      },
      oas: {
        paths: {
          '{url-manager}/category/cases': {
            'get': {
              operationId: 'category-cases',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'categoryId',
                  in: 'query'},
                {name: 'clearance',
                  in: 'query'},
                {name: 'fInstitution',
                  in: 'query'},
                {name: 'fUserType',
                  in: 'query'},
                {name: 'fSpecialty',
                  in: 'query'},
                {name: 'fProperty',
                  in: 'query'},
                {name: 'fPropertyValue',
                  in: 'query'},
                {name: 'fSearchStr',
                  in: 'query'},
                {name: 'page',
                  in: 'query'},
                {name: 'nItems',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'clearance': new URL(document.location).searchParams.get('clearance'),
        'fProperty': new URL(document.location).searchParams.get('prop'),
        'fInstitution': new URL(document.location).searchParams.get('fInstitution'),
        'fUserType': new URL(document.location).searchParams.get('fUserType'),
        'fSpecialty': new URL(document.location).searchParams.get('fSpecialty'),
        'fPropertyValue': new URL(document.location).searchParams.get('fPropertyValue'),
        'fSearchStr': new URL(document.location).searchParams.get('fSearchStr'),
        'fGroup': new URL(document.location).searchParams.get('fGroup'),
        'page': new URL(document.location).searchParams.get('page'),
        'nItems': new URL(document.location).searchParams.get('limit'),
      },
      oas: {
        paths: {
          '{url-manager}/user/cases': {
            'get': {
              operationId: 'cases-list',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'clearance',
                  in: 'query'},
                {name: 'fInstitution',
                  in: 'query'},
                {name: 'fUserType',
                  in: 'query'},
                {name: 'fSpecialty',
                  in: 'query'},
                {name: 'fProperty',
                  in: 'query'},
                {name: 'fPropertyValue',
                  in: 'query'},
                {name: 'fSearchStr',
                  in: 'query'},
                {name: 'fGroup',
                  in: 'query'},
                {name: 'page',
                  in: 'query'},
                {name: 'nItems',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-share-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        // 'table_id': sessionStorage.getItem('caseList'),
      },
      oas: {
        paths: {
          '{url-manager}/case/share': {
            'post': {
              operationId: 'share-cases',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'clearance',
                  in: 'query'},
                {name: 'entity',
                  in: 'query'},
                {name: 'subject',
                  in: 'query'},
                {name: 'subject_grade',
                  in: 'query'},
                {name: 'clearance',
                  in: 'query'},
                {name: 'table_id',
                  in: 'query'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-quest-list',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/author/quests': {
            'get': {
              operationId: 'quests',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-quest-cases',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'questId': new URL(document.location).searchParams.get('id')
      },
      oas: {
        paths: {
          '{url-manager}/author/quest/cases?questId={questId}': {
            'get': {
              operationId: 'cases',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'questId',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-player-quests',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/player/quests': {
            'get': {
              operationId: 'quests',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )
  //Retrieves all institutions from database
  DCC.component(
    'harena-institutions',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
      },
      oas: {
        paths: {
          '{url-manager}/institutions': {
            'get': {
              operationId: 'institutions-list',
              parameters: [
                {name: 'url-manager',
                 in: 'path'}
              ]
            }
          }
        }
      }
    }
  )

    //Retrieves groups that user is a part of
    DCC.component(
      'harena-user-groups',
      'dcc-rest',
      {
        environment: {
          'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        },
        oas: {
          paths: {
            '{url-manager}/group': {
              'get': {
                operationId: 'user-group-list',
                parameters: [
                  {name: 'url-manager',
                   in: 'path'}
                ]
              }
            }
          }
        }
      }
    )

  DCC.component(
    'harena-ask-feedback',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'entity': 'institution',
        'clearance': '5',
        'subject_grade':'professor',
        'subject': sessionStorage.getItem('harena-user-institution-id'),
        'table_id': new URL(document.location).searchParams.get('id'),
      },
      oas: {
        paths: {
          '{url-manager}/case/share': {
            'post': {
              operationId: 'ask-feedback',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'clearance',
                  in: 'query'},
                {name: 'entity',
                  in: 'query'},
                {name: 'subject',
                  in: 'query'},
                {name: 'subject_grade',
                  in: 'query'},
                {name: 'table_id',
                  in: 'query'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-case-property',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'case_id': new URL(document.location).searchParams.get('id'),
      },
      oas: {
        paths: {
          '{url-manager}/case/property': {
            'post': {
              operationId: 'case-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'case_id',
                  in: 'query'},
                {name: 'property_title',
                  in: 'query'},
                {name: 'property_value',
                  in: 'query'},
              ]
            },
            'put': {
              operationId: 'case-property-put',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'case_id',
                  in: 'query'},
                {name: 'property_title',
                  in: 'query'},
                {name: 'property_value',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-case-property-put',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'case_id': new URL(document.location).searchParams.get('id'),
      },
      oas: {
        paths: {
          '{url-manager}/case/property': {
            'put': {
              operationId: 'case-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'case_id',
                  in: 'query'},
                {name: 'property_title',
                  in: 'query'},
                {name: 'property_value',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-user-property',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'}
              ]
            },
            'post': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
                {name: 'propertyValue',
                  in: 'query'},
              ]
            },
            'put': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
                {name: 'propertyValue',
                  in: 'query'},
              ]
            },
          }
        }
      }
    }
  )

  DCC.component(
    'harena-prognosis-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':'prognosis-current-lvl',
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-prognosis-highest-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':'prognosis-highest-lvl',
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-prognosis-perfect-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':`prognosis-lvl-${localStorage.getItem('prognosis-current-lvl')}-perfect`,
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )
  //Prognosis challenge 1
  DCC.component(
    'harena-prognosis-challenge1-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':'prognosis-challenge1-current-lvl',
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-prognosis-challenge1-highest-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':'prognosis-challenge1-highest-lvl',
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  //Prognosis challenge 2
  DCC.component(
    'harena-prognosis-challenge2-highest-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':'prognosis-challenge2-highest-lvl',
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-prognosis-challenge2-lvl',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'propertyTitle':'prognosis-challenge2-current-lvl',
      },
      oas: {
        paths: {
          '{url-manager}/user/property': {
            'get': {
              operationId: 'user-property',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'propertyTitle',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-create-logger',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api
      },
      oas: {
        paths: {
          '{url-manager}/logger': {
            'post': {
              operationId: 'create-logger',
              parameters: [
                {name: 'url-manager',
                 in: 'path'},
                {name: 'caseId',
                 in: 'query'},
                {name: 'instanceId',
                 in: 'query'},
                {name: 'log',
                 in: 'query'}
              ]
            }
          }
        }
      }
    }
  )

  DCC.component(
    'harena-cases-inf331',
    'dcc-rest',
    {
      environment: {
        'url-manager': HarenaConfig.manager.url + HarenaConfig.manager.api,
        'clearance': 5,
        'fSearchStr': 'INF 331 - Laboratório',
        'page': 1,
        'nItems': 30,
      },
      oas: {
        paths: {
          '{url-manager}/user/cases': {
            'get': {
              operationId: 'cases-list',
              parameters: [
                {name: 'url-manager',
                  in: 'path'},
                {name: 'clearance',
                  in: 'query'},
                {name: 'fSearchStr',
                  in: 'query'},
                {name: 'page',
                  in: 'query'},
                {name: 'nItems',
                  in: 'query'},
              ]
            }
          }
        }
      }
    }
  )

})()
