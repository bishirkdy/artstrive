// import { OrbitLoader } from 'react-loaderkit';
import { HashLoader } from "react-spinners";

// export default function MyComponent() {
//   return (
//     <OrbitLoader 
//       size={47} 
//       color="#13F287"
//       speed={0.5} 
//     />
//   );
// }

export function Loader() {
  return <HashLoader color="#13F287" size={100} />;
}
