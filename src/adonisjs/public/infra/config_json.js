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
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "user/login/+",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "user_login",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "case/get/+",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "case_request",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "service/request/get",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "request_get",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "data/template/+/get",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "template_request",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "response/#/data/template/+/get",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "template_request",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "response/#/case/get/+",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "case_response",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "case/ready/+",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "case_ready",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format :"knot/navigate/<<",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "first_knot_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "case/start/+",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "case_start",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "data/theme/+/get",             
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "theme_tequest",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "response/#/data/theme/+/get",             
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "theme_tequest",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component :"Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "knot/start/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "knot_start",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component :"Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "input/typed/+/hypothesis",
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "var_typed",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "input/changed/+/hypothesis",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "var_changed",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "input/submit/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "submit_knot_inputs",
                                        payload_body : "string_json"
                                    }
                        },

                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "var/set/+/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "store_var_value",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "knot/end/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_end",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "case/completed/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "case_completed",
                                        
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "send",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            
                            topic_format : "case/summary/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "case_summary",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "knot/navigate/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "knot/navigate/>",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "knot/navigate/<",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "flow/navigate/>",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "knot_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "case/navigate/>",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "user_action",
                                        message_subclass : "case_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "knot/navigate/=/+",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "knot_navigation",
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            accumulator: "accumulate",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_format : "'=+/navigate/!",
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        message_class : "system_message",
                                        message_subclass : "knot_navigation",
                                        payload_body : "string_json"
                                    }
                        }
                        

                    ]

   
  }
  
  (function () {
  })()
  