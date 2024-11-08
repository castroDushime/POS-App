import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PrintableContent = React.forwardRef((props, ref) => (
    <div ref={ref} className="container-fluid bg-white rounded">
        <div className="tw-flex tw-flex-col tw-items-center">
            <img src="https://infypos-demo.nyc3.digitaloceanspaces.com/settings/337/logo-80.png" alt="logo" className="w-20 h-20" />
            <div className="mb-6">
                <p className="mb-2"><strong>Reference:</strong> SA_112323232</p>
                <p className="mb-2"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
        </div>
        <div className="mb-4">
            <h2 className="tw-text-xl tw-font-semibold">Customer Information</h2>
            <p className="mb-0 border border-bottom border-0"><strong>Name:</strong> {props.selectedCustomer?.name}</p>
            <p className="mb-0 border border-bottom border-0"><strong>Email:</strong> {props.selectedCustomer?.email}</p>
            <p className="mb-0 border border-bottom border-0"><strong>Phone:</strong> {props.selectedCustomer?.phone}</p>
            <p className="mb-0 border border-bottom border-0"><strong>Address:</strong> {props.selectedCustomer?.address}</p>
        </div>
        <div className="mb-">
            {props.tableRows.map((item, index) => (
                <div key={index} className="tw-border mb-3 tw-border-b-1 tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-border-dashed">
                    <h6 className="tw-font-semibold mb-1">{item.product}</h6>
                    <div className="tw-flex tw-justify-between">
                        <p className="mb-1">{item.qty}x{Number(item.netUnitPrice).toLocaleString()}</p>
                        <p className="mb-1">Rwf {Number(item.subTotal).toLocaleString()}</p>
                    </div>
                </div>
            ))}
            <div className="tw-flex tw-flex-col">
                <div className="d-flex justify-content-between">
                    <p className="mb-1"><strong>Order Tax:</strong></p>
                    <p className="mb-1">Rwf {props.formData.orderTAX}</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="mb-1"><strong>Discount:</strong></p>
                    <p className="mb-1">Rwf {props.formData.discount}</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="mb-1"><strong>Shipping:</strong></p>
                    <p className="mb-1">Rwf {props.formData.shipping}</p>
                </div>
                <p><strong>Total Amount:</strong> Rwf {props.calculateTotalAmount()}</p>
            </div>
        </div>
    </div>
));

const PrintComponent = ({ selectedCustomer, tableRows, formData, calculateTotalAmount }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <PrintableContent
                ref={componentRef}
                selectedCustomer={selectedCustomer}
                tableRows={tableRows}
                formData={formData}
                calculateTotalAmount={calculateTotalAmount}
            />
            {/*<button onClick={handlePrint} className="btn btn-primary">Print</button>*/}
        </div>
    );
};

export default PrintComponent;