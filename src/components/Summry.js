import { useEffect, useState } from "react";
import { calcTotalHamshPerSeller, calcTotalPrice, prdPerSeller, calcWastMoney } from "./ImportantCalcs";

const Summry = () => {

	const [isLoading, setIsLoding] = useState(false);
	const [recepts, setRecepts] = useState([]);
	const [returnR, setReturnR] = useState([]);
	const [products, setProducts] = useState([]);
	const [error, setError] = useState();

	const uniqueType = [...new Set(products.map((product) => product.seller))];

	// const prevSeller = () => {
	// 	// products &&
	// 	// for (let i = 0; i <= setSellers().length; i++) {
	// 	// 	<div>s</div>
	// 	// }
	// }

	useEffect(() => {
		const fetchRecepts = async () => {
			setIsLoding(true);

			try {
				const Rresponse = await fetch("http://localhost:8080/recepts");
				const receptsData = await Rresponse.json();
				setReturnR(receptsData.filter(rcp => rcp.retunFlag === true))
				setRecepts(receptsData.filter(rcp => rcp.retunFlag === false));

				const Presponse = await fetch("http://localhost:8080/products");
				const productsData = await Presponse.json();
				setProducts(productsData);

			} catch (error) {
				setError(error);
			}
			setIsLoding(false);
		}
		fetchRecepts()

	}, [])
	return (
		<div className="summry-container">
			<h1 className="summry-title">احصائيات البائعين</h1>
			{uniqueType.map((seller) => (
				<div key={seller} className="summry-container-detail">
					<div className="summry-seller-name">{seller}</div>
					<div>
						<div className="summry-seller-detail">
							<div className="summry-seller-detail-item">
								<div>اجمالي المُباع: </div>
								<div>{calcTotalPrice(recepts, seller)}</div>
							</div>
							<div className="summry-seller-detail-item">
								<div>اجمالي الربح: </div>
								<div>{calcTotalHamshPerSeller(recepts, seller)}</div>
							</div>

							<div className="summry-seller-detail-item">
								<h2>مصروفات</h2>
							</div>
							<div className="summry-seller-detail-item">
								<div>مصروفات الحالي: </div>
								<div>{calcWastMoney(recepts, seller).toLocaleString()}</div>
							</div>
							<div className="summry-seller-detail-item">
								<div>مصروفات المرتجعات:  </div>
								<div>{calcWastMoney(returnR, seller).toLocaleString()}</div>
							</div>
							<hr></hr>
							<pre style={{ fontSize: "larger", fontWeight: "bold" }}>{prdPerSeller(recepts, seller)}</pre>
						</div>
					</div>
				</div>

			))}

		</div>
	);
}

export default Summry;