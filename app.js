const App = document.querySelector("#app");

const e = React.createElement;

const products = axios.get(
  "https://acme-users-api-rev.herokuapp.com/api/products"
);
const companies = axios.get(
  "https://acme-users-api-rev.herokuapp.com/api/companies"
);

class productsClass extends React.Component {
  render() {
    let children = [];
    const { products } = this.props;
    for (let i = 0; i < products.length; i++) {
      children.push(
        e(
          "li",
          { className: "list-group-item" },
          `${products[i].name} - ${products[i].description}`
        )
      );
    }
    return e("ul", { className: "list-group" }, ...children);
  }
}

class companiesClass extends React.Component {
  render() {
    let children = [];
    const { companies } = this.props;
    for (let i = 0; i < companies.length; i++) {
      children.push(
        e("li", { className: "list-group-item" }, `${companies[i].name}`)
      );
    }
    return e("ul", { className: "list-group" }, ...children);
  }
}

class Container extends React.Component {
  state = {
    products: [],
    companies: [],
    loading: true,
    view: "products",
  };

  componentDidMount() {
    Promise.all([products, companies]).then(([productsData, companiesData]) => {
      this.setState({
        products: productsData.data,
        companies: companiesData.data,
        loading: false,
      });
      console.log(this.state);
    });
    window.addEventListener('hashchange', (ev) => {
        ev.preventDefault();
        this.setState({
            view: `${window.location.hash.slice(1)}`
        });
        console.log('hash', ev.target)})
  }

  render() {
    let chosenView = "";
    let { products, companies, view } = this.state;
    let selectedPro = "";
    let selectedCom = "";

    view = window.location.hash.slice(1);

    console.log(view);
    if (view === "products") {
      selectedPro = "selected";
      selectedCom = "notSelected";
      chosenView = e(productsClass, {
        className: "products",
        products: products,
      });
    } else {
      selectedCom = "selected";
      selectedPro = "notSelected";
      chosenView = e(companiesClass, {
        className: "companies",
        companies: companies,
      });
    }

    return e(
      "div",
      {
        className: "Container",
        style: {
          fontFamily: "sans-serif",
        },
      },
      e(
        "div",
        {
          className: "navBar",
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            textDecoration: "underline",
          },
        },
        e(
          "div",
          {
            className: `${selectedPro}`,
            onClick: (ev) => {
              ev.preventDefault();
              window.location.hash = "products";
            //   this.setState({
            //     view: "products",
            //   });
            },
          },
          `Products (${products.length})`
        ),
        e(
          "div",
          {
            className: `${selectedCom}`,
            // onClick: (ev) => {
            //   ev.preventDefault();
            //   window.location.hash = "companies";
            // //   this.setState({
            // //     view: "companies",
            // //   });
            // },
          },
          e('a', {href: 'index.html#companies'}, `Companies (${companies.length})`)
        )
      ),
      chosenView
    );
  }
}

ReactDOM.render(e(Container), App, () => console.log("rendered!"));