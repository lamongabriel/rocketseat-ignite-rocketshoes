import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createServer, Model } from 'miragejs';

createServer({

  models: {
    product: Model,
    stock: Model
  },

  seeds(server) {
    server.db.loadData({
      products: [
        {
          id: 1,
          title: "Tênis de Caminhada Leve Confortável",
          price: 179.9,
          image: "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
        },
        {
          id: 2,
          title: "Tênis VR Caminhada Confortável Detalhes Couro Masculino",
          price: 139.9,
          image: "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg"
        },
        {
          id: 3,
          title: "Tênis Adidas Duramo Lite 2.0",
          price: 219.9,
          image: "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis3.jpg"
        },
        {
          id: 5,
          title: "Tênis VR Caminhada Confortável Detalhes Couro Masculino",
          price: 139.9,
          image: "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg"
        },
        {
          id: 6,
          title: "Tênis Adidas Duramo Lite 2.0",
          price: 219.9,
          image: "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis3.jpg"
        },
        {
          id: 4,
          title: "Tênis de Caminhada Leve Confortável",
          price: 179.9,
          image: "https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
        }
      ],
      stocks: [
        {
          id: 1,
          amount: 3
        },
        {
          id: 2,
          amount: 5
        },
        {
          id: 3,
          amount: 2
        },
        {
          id: 4,
          amount: 1
        },
        {
          id: 5,
          amount: 5
        },
        {
          id: 6,
          amount: 10
        }
      ]
    })
  },

  routes() {
    this.namespace = 'api'

    this.get('/stocks/:id', (schema, request) => {
      const id = request.params.id
      return this.schema.find('stock', id)
    })

    this.get('/products/:id', (schema, request) => {
      const id = request.params.id
      return this.schema.find('product', id)
    })

    this.get('/products/', () => {
      return this.schema.all('product')
    })

    this.get('/stocks/', () => {
      return this.schema.all('stock')
    })

  },
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
