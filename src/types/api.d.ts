export type ApiResponse<T> = {
  data: T
  message?: string
}

baseUrl = "http://localhost:3000/api";

addsubject = "{baseUrl}/addsubject";
getsubjects = "/getsubjects";
updatesubject = "/updatesubject";
deletesubject = "/deletesubject";
getsubject = "/getsubject";
getsubjectbyid = "/getsubjectbyid";
getsubjectbyname = "/getsubjectbyname";


