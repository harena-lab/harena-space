/* Logger DCC
  ***********/

class CONFIG_LOGGER {
    constructor() {

    }

    static version = "v1"
    static config_json=[
                        {
                            component : "Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^data\/case\/.*\/get$/g,
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        payload_metada : {
                                            message_class : "operational",
                                            message_subclass : "case_exectuion"
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
                                        payload_metada : {
                                            message_class : "operational",
                                            message_subclass : "case_exectuion"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component :"Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^var\/.*.hypothesis\/typed$/g,
                            schema : {
                                        version : this.version,
                                        topic : "string",
                                        payload_metada : {
                                            message_class : "operational",
                                            message_subclass : "case_exectuion"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },
                        {
                            component : "Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^var\/.*.hypothesis\/changed$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        payload_metada : {
                                            message_class : "operational",
                                            message_subclass : "case_exectuion"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },

                        {
                            component : "Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^case\/summary$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        payload_metada : {
                                            message_class: "operational",
                                            message_subclass : "case_exectuion"
                                                            },
                                        payload_body : "string_json"
                                    }
                        },

                        {
                            component : "Analytics proxy",
                            endpoint : "http://localhost/api/v1/kafka_messages/",
                            topic_regex : /^knot\/.*\/end$/g,
                            schema : {  
                                        version : this.version,
                                        topic : "string",
                                        payload_metada : {
                                            message_class : "operational",
                                            message_subclass : "case_exectuion"
                                                            },
                                        payload_body : "string_json"
                                    }
                        }

                    ]

   
  }
  
  (function () {
  })()
  