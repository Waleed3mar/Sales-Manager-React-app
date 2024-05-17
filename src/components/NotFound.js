import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div>
			<h2>عذرا</h2>
			<p>لم يتم العثور على هذه الصفحة :(</p>
			<Link to="/">العودة للصفحة الرئيسة...</Link>
		</div>
	);
};

export default NotFound;
