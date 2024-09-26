import { combineReducers } from "@reduxjs/toolkit";
import khamphaReducer from "../features/khamphaSlice";
import watershowReducer from "../features/sukienSlice";
import sukiensliderReducer from "../features/sukiensliderSlice";
import sukienfooterReducer from "../features/sukienfooterSlice";
import lichsuReducer from "../features/lichsuSlice";
import thanhviennhahangReducer from "../features/thanhviennhahangSlice";
import thanhviencfReducer from "../features/thanhviencfSlice";
import quangtruongslider1Reducer from "../features/quangtruongslider1Slice";
import quangtruongslider2Reducer from "../features/quangtruongslider2Slice";
import quangtruongslider3Reducer from "../features/quangtruongslider3Slice";
import quangtruongslider4Reducer from "../features/quangtruongslider4Slice";
import quangtruongReducer from "../features/quangtruongfooterSlice";
import khiduoidaiReducer from "../features/khiduoidaifooterSlice";
import cachepsliderReducer from "../features/cachepsliderSlice";
import cachepfooterReducer from "../features/cachepfooterSlice";
import thucvatcardReducer from "../features/thucvatSlice";
import thucvatfooterReducer from "../features/thucvatfooterSlice";

const rootReducer = combineReducers({
    khampha: khamphaReducer,
    watershow: watershowReducer,
    sukienslider: sukiensliderReducer,
    waterfooter: sukienfooterReducer,
    services: lichsuReducer,
    thanhviennhahang: thanhviennhahangReducer,
    thanhviencf: thanhviencfReducer,
    quangtruongslider1: quangtruongslider1Reducer,
    quangtruongslider2: quangtruongslider2Reducer,
    quangtruongslider3: quangtruongslider3Reducer,
    quangtruongslider4: quangtruongslider4Reducer,
    quangtruong: quangtruongReducer,
    khiduoidai: khiduoidaiReducer,
    cachepslider: cachepsliderReducer,
    cachep: cachepfooterReducer,
    thucvat: thucvatfooterReducer,
    thucvatcard: thucvatcardReducer,






});

export default rootReducer;
