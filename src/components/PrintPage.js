import ReceptDetails from "./ReceptDetails";
const PrintPage = () => {
	return (
		<div className="print-container">
			<ReceptDetails isPrint={true} />
		</div>
	);
};

export default PrintPage;
