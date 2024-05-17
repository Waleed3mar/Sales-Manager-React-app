import { Link } from "react-router-dom";
import { FaBox, FaCog, FaChartPie, FaChartLine } from "react-icons/fa";

function Navbar() {
	return (
		<div className="navBar">
			<h1 id="app-title">ادارة المــبـيعات</h1>

			<div className="links">
				<div>
					<Link to="/">
						<div
							style={{ position: "relative", top: "2px", display: "inline" }}
						>
							<FaChartLine />
						</div>{" "}
						المبيعات{" "}
					</Link>
				</div>
				<div>
					<Link to="/products">
						<div
							style={{
								paddingLeft: "5px",
								position: "relative",
								top: "2px",
								display: "inline",
							}}
						>
							<FaBox />
						</div>
						المنتجات{" "}
					</Link>
				</div>
				<div>
					<Link to="/summry">
						<div
							style={{
								paddingLeft: "5px",
								position: "relative",
								top: "2px",
								display: "inline",
							}}
						>
							<FaChartPie />
						</div>
						احصائيات{" "}
					</Link>
				</div>
				<div id="addR">
					<Link
						to="/createR"
						state={{
							isEditing: false,
						}}
					>
						{" "}
						اضافة فاتورة{" "}
					</Link>
				</div>
				<div id="settings">
					<Link to="/Settings">
						<FaCog />
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
