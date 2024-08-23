import { ServerConfig } from "miragejs/server";
import { SchoolCourseTemplate } from "./course.mock";

declare function MirageServerProvider(
  props: { 
    children: React.ReactNode
    mockCourses: SchoolCourseTemplate[]
  }
): JSX.Element;

export default MirageServerProvider;