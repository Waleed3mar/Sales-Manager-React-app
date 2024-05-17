import { useEffect, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { calcTotalHamshPerSeller, calcWastMoney } from "./ImportantCalcs";

const Recept = ({ recepts, title }) => {
	const [search, setSearch] = useState("");
	const [searchBy, setBearchBy] = useState("NOC");

	const [typeOfR, setTypeOfR] = useState(false);
	const [dateFlag, setDateFlag] = useState(false);

	const [origRecept, setOrigRecept] = useState(recepts.filter(rcp => rcp.retunFlag === false));
	const [revRecept, setRevRecept] = useState(origRecept);
	const [dateT, setDateT] = useState([]);

	let x = 0;
	let z = 0;
	let v;

	const handleShow = (s) => {
		setDateT(s)
		let t = recepts.filter(rcp => rcp.retunFlag === s)
		setRevRecept(t);
		setTypeOfR(s)
		console.log(origRecept)
	}

	const revByDate = (month) => {
		setDateT(month)
		if (month == [] | month === "all") {
			setRevRecept(recepts.filter(rcp => rcp.retunFlag === typeOfR))
		} else {
			let newR = []
			let newR2 = []
			newR2 = recepts.filter(rcp => rcp.retunFlag === typeOfR)
			newR = newR2.filter(rcp => rcp.date.slice(0, -3) === month);
			console.log(newR);
			setRevRecept(newR)
		}
		console.log(month)
	}

	const calcTotal = () => {
		// recepts && 
		revRecept.map((prd) => (x += prd.prise));
		return x;
	};
	const calcTotalUnits = () => {
		// recepts &&
		revRecept.map((rcp) => {

			v = Object.keys(rcp.products).map((key) => rcp.products[key]);

			for (let i = 0; i < v.length; i++) {
				z += v[i];
			}
		});
		return z;
	};
	useEffect(() => {
		// setTypeOfR(false)
	}, [])
	const removeSeller = (fullName) => {
		let prdNameList = fullName.split(" ");
		prdNameList.pop();

		let prodName = prdNameList.join(" ");

		return prodName;
	};
	const removeProdName = (fullName) => {
		let prdNameList = fullName.split(" ");
		let lastWord = prdNameList.pop();

		return lastWord;
	};
	return (
		<>
			<div className="search-container">
				<div className="search-center-container">
					<div className="search-input">
						<input
							placeholder="ابحث..."
							className="search"
							onChange={(e) => setSearch(e.target.value)}
						></input>
					</div>
					<div className="search-by">
						<select
							className="searchBy"
							value={searchBy}
							onChange={(e) => setBearchBy(e.target.value)}
						>
							<option value="NOC">بالاسم</option>
							<option value="id">بالكود</option>
							<option value="phone">برقم الهاتف</option>
							<option value="more">اكثر</option>
							<option value="less">اقل</option>
							<option value="pro">منتج / بائع</option>
						</select>
					</div>
				</div>
			</div>

			<div className="middle-container">
				<div className="title-container">
					<div>
						<h2 className="title">{title}</h2>
						<div>
							<button
								className="show-recept showR"
								onClick={() => handleShow(false)}
								style={typeOfR === false ? { color: "#03A9F4" } : { fontSize: "17px", cursor: "pointer" }}
							>
								حالية</button>
							<button
								className="show-rtrn-recept showR"
								onClick={() => handleShow(true)}
								style={typeOfR === true ? { color: "#03A9F4" } : { fontSize: "17px", cursor: "pointer" }}
							>
								مُرتجع</button>
						</div>
					</div>

				</div>

				<div className="receptContainer">
					<div className="info-line">
						<div className="add-prd">
							<div className="details">
								<span>اجمالي سعر المُباع | </span>
								<div className="total-prd-price">
									{calcTotal().toLocaleString()} ج<span> </span>
								</div>
							</div>
							<div className="details details-units">
								<span>عدد الوحدات المُباعة | </span>
								<div className="total-prd-price">{calcTotalUnits().toLocaleString()}</div>
							</div>
							<div className="details details-units">
								<span>اجمالي الربح | </span>
								<div className="total-prd-price">{calcTotalHamshPerSeller(revRecept, "").toLocaleString()}</div>
							</div>
							<div className="details details-units">
								<span>مصروفات | </span>
								<div className="total-prd-price">{calcWastMoney(revRecept, "").toLocaleString()} ج </div>
							</div>

							<div className="details details-units">
								<button
									style={{ background: "#0000", border: "none" }}
									onClick={() => {
										setDateFlag(!dateFlag);
										revByDate("all")
									}}
								>
									<FaFilter style={dateFlag ? { color: "#03A9F4" } : { color: "#eee" }} />
								</button>
								<div
									className="total-prd-price"
									style={dateFlag ? {} : { display: "none" }}
								>
									<input
										style={{
											cursor: "pointer",
											background: "#0000",
											border: "none",
											// borderRadius: "30px",
											color: "#eee"
										}}
										value={dateT}
										type="month"
										onChange={(e) => revByDate(e.target.value)}
									></input>
									<button
										onClick={() => revByDate("all")}
										style={{
											background: "#0000",
											border: "none",
											color: "#b71c1c",
											cursor: "pointer"
										}}> <FaTimes />
									</button>
								</div>
							</div>
						</div>
						<hr />
					</div>
					{revRecept
						.filter((recept) => {
							if (searchBy === "NOC") {
								return search === "" ? recept : recept.NOC.includes(search);
							} else if (searchBy === "id") {
								return search === ""
									? recept
									: recept.id === parseInt(search);
							} else if (searchBy === "phone") {
								return search === "" ? recept : recept.phone.includes(search);
							} else if (searchBy === "more") {
								return search === ""
									? recept
									: recept.prise >= parseInt(search);
							} else if (searchBy === "less") {
								return search === ""
									? recept
									: recept.prise <= parseInt(search);
							} else {
								return search === "" ? recept : recept.pForSearch.includes(search);
							}
						})
						.reverse().map((recept) => (
							<div style={{ position: "relative" }}>
								<div className="recept" key={recept.id}>
									<div className="rcpt-id">{recept.id}</div>
									<div className="single-recept-info">
										<div className="single-recept-info-container">
											<h1>
												<span>اسم العميل:</span> {recept.NOC}
											</h1>
											<h2>
												<span>موبايل:</span> {recept.phone}
											</h2>
											<span>
												<span>المشتريات:</span>
												<ul>
													{Object.keys(recept.products)
														.map((key) => (<div key={key}>
															<><li>{recept.products[key]} {removeSeller(key)} - <div style={{ color: "#795548", display: "inline" }}> {removeProdName(key)}</div> </li></>
														</div>))
													}
												</ul>
											</span>
											<span>
												<span>المصروفات:</span>
												<span>{recept.wastMony.toLocaleString()}</span>
											</span>
											<span>
												<span>العنوان: </span>
												{recept.address}
											</span>
											<span>
												<span>بتاريخ: </span>
												{recept.date}
											</span>
										</div>
									</div>
									<div className="single-recept-price-container">
										<span className="price">التكلفة: </span>
										<span className="price-n">
											{" "}
											{recept.prise.toLocaleString()} ج
										</span>
									</div>
									<span>
										<span id="more-link">
											<Link to={`/recepts/${recept.id}`}>عرض..</Link>
										</span>
									</span>
								</div>
							</div>
						))}
				</div>
			</div>
		</>
	);
};
export default Recept;
