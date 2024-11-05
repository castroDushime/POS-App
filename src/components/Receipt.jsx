import React from 'react';

const Receipt = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <h1>Receipt</h1>
        <p>Sale ID: {props.sale.id}</p>
        <p>Customer: {props.sale.customer.name}</p>
        <p>Total Amount: Rwf {Number(props.sale.totalAmount).toLocaleString()}</p>
        <p>Status: {props.sale.status}</p>
        <p>Created At: {props.sale.createdAt}</p>
    </div>
));

export default Receipt;