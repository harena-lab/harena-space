/* Logger DCC
  ***********/

class CONFIG_LOGGER {
    constructor() {

    }

    static version = "v1"
    static size_buffer = 20
    static config_json=[
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/case\/.*\/get$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "case_request",
                            
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "case_request"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^service\/request\/get$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "template_request",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "template_request"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/template\/.*\/get$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "template_request",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "template_request"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/template\/.*\/get\/response\/.*$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "template_request",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "template_request"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/case\/.*\/get\/response\/.*$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "case_response",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "case_response"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^control\/case\/ready$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "case_compiled",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "case_compiled"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^knot\/<<\/navigate$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "first_knot_navigation",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "first_knot_navigation"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/theme\/.*\/get$/g,
                                            
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "theme_tequest",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "theme_tequest"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/theme\/.*\/get\/response\/.*$/g,             
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "theme_tequest",
                            
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "theme_tequest"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component :"Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^knot\/.*\/start$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "knot_start",
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "knot_start"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component :"Analytics proxy",
                            accumulator: true,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^var\/.*\/typed$/g,
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "var_typed",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "var_typed"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^var\/.*\/changed$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "var_changed",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "var_changed"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^flow\/>\/navigate$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "knot_navigation"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },

                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^flow\/<\/navigate$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "knot_navigation"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^knot\/>\/navigate$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "knot_navigation"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^knot\/<\/navigate$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "knot_navigation"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            
                            topic_regex : /^knot\/.*\/navigate$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_metada : {
                                            message_class : "user_action",
                                            message_subclass : "knot_navigation"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^control\/input\/submit$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "submit_knot_inputs",
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "submit_knot_inputs"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^var\/.*\/set$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "store_var_value",
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "store_var_value"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },

                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^var\/.*\/set\/response\/.*$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "var_stored",
                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "var_stored"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^case\/summary$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "case_summary",

                                        payload_metada : {
                                            message_class: "system_message",
                                            message_subclass : "case_summary"
                                                            },
                                                            
                                        payload_body : "string_json"
                                    }
                        },

                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^knot\/.*\/end$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "knot_end",

                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "knot_end"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: false,
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^case\/completed$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "case_end",

                                        payload_metada : {
                                            message_class : "system_message",
                                            message_subclass : "case_end"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        

                    ]

   
  }
  
  (function () {
  })()
  