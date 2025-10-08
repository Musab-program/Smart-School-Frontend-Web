import { getTeacherAnalytics } from "../main/api-providers";
import App from "./Form";

export default async function Page () {

  const data = await getTeacherAnalytics();
  
return(
  <App data={data} />
)
}

