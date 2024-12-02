import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import http from '../services/httpService.js';
import {getCurrentUser} from "../services/authService.js";
import PropTypes from "prop-types";

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);
export const ContentProvider = ({children}) => {
    const hasFetched = useRef(false);
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        user = getCurrentUser();
    }

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [units, setUnits] = useState([]);
    const [users, setUsers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [roles, setRoles] = useState([]);
    const fetchBrands = () => {
        http.get("/brands")
            .then((res) => {
                let data = res.data;
                setBrands(data);
            }).catch((error) => {
            console.log(error);
        });
    }
    const fetchCategories = () => {
        http.get("/categories")
            .then((res) => {
                let data = res.data;
                setCategories(data);
            }).catch(() => {
        });
    }
    const fetchProduct = () => {
        http.get("/products")
            .then((res) => {
                let data = res.data;
                setProducts(data);
            }).catch(() => {

        });

    }
    const fetchBranches = () => {
        http.get("/branches")
            .then((res) => {
                let data = res.data;
                setBranches(data);
            }).catch(() => {

        });

    }
    const fetchSales = () => {
        http.get("/sales")
            .then((res) => {
                let data = res.data;
                setSales(data);
            }).catch(() => {
            console.log("Error fetching sales");
        });
    }
    const fetchPurchases = () => {
        http.get("/purchases")
            .then((res) => {
                let data = res.data;
                setPurchases(data);
            }).catch((error) => {
            console.log(error);

        });
    }
    const fetchUnits = () => {
        http.get("/units")
            .then((res) => {
                let data = res.data;
                setUnits(data);
            }).catch((error) => {
            console.log(error);

        });
    }
    const fetchUsers = () => {
        http.get("/users")
            .then((res) => {
                let data = res.data;
                setUsers(data);
            }).catch(() => {

        });
    }
    const fetchSuppliers = () => {
        http.get("/suppliers")
            .then((res) => {
                let data = res.data;
                setSuppliers(data);
            }).catch((error) => {
            console.log(error);
        });
    }
    const loadRoles = () => {
        http.get("/roles")
            .then((res) => {
                let data = res.data;
                setRoles(data);
            }).catch((error) => {
            console.log(error);
            });
    }
    useEffect(() => {
        const interval = setInterval(() => {
            if (user) {
                if (!hasFetched.current) {
                    fetchBrands();
                    fetchCategories();
                    fetchProduct();
                    fetchBranches();
                    fetchSales();
                    fetchPurchases();
                    fetchUnits();
                    fetchUsers();
                    fetchSuppliers();
                    loadRoles();
                    hasFetched.current = true;
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [user]);
    let value = {
        brands, setBrands, categories, setCategories, products, setProducts, branches, setBranches,suppliers, setSuppliers,
        sales, setSales, purchases, setPurchases, units, setUnits, users, setUsers,roles, setRoles,loadRoles, fetchUsers,
        fetchUnits, fetchPurchases, fetchBrands, fetchCategories, fetchProduct, fetchBranches, fetchSales,fetchSuppliers
    };
    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
}
ContentProvider.propTypes = {
    children: PropTypes.node.isRequired
}
