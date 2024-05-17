// import { useEffect, useState } from "react";
import Recept from "./Recepts";
import useFetch from "../Hooks/useFetch";

const Home = () => {
	const {
		data: recepts,
		isLoading,
		error,
	} = useFetch("http://localhost:8080/recepts");


	return (
		<div className="home">
			{error && <p>{error}</p>}
			{isLoading && <p>جارٍ التحميل ....</p>}

			{recepts && <Recept recepts={recepts} title={"أخر الفواتير"} />}
		</div>
	);
};
export default Home;
