import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Watermark = ({ show, children }) => {
    if (!show)
        return _jsx(_Fragment, { children: children });
    return (_jsxs("div", { className: "relative", children: [children, _jsx("div", { className: "absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-10", children: _jsx("div", { className: "text-6xl font-bold text-gray-900 rotate-[-45deg] select-none", children: "PLAN GRATUITO" }) })] }));
};
