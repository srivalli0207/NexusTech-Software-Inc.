import { useParams } from "react-router-dom"

export default function DynamicRouteTest() {
   const { post_id } = useParams()

   return (
      <p>dynamic route: {post_id}</p>
   )
}