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
import trangchuReducer from "../features/trangchuSlice";
import lichsucontentReducer from "../features/lichsucontentSlice";
import thanhviencontentReducer from "../features/thanhviencontentSlice";
import cachepcontentReducer from "../features/cachepcontentSlice";
import khiduoidaicontentReducer from "../features/khiduoidaicontentSlice";
import thucvatcontentReducer from "../features/thucvatcontentSlice";
import baomatcontentReducer from "../features/baomatcontentSlice";
import congviencontentReducer from "../features/congviencontentSlice";
import tapthecontentReducer from "../features/tapthecontentSlice";
import chuyReducer from "../features/chuySlice";
import thongtincanhanReducer from "../features/thongtincanhanSlice";
import baomatsubcontentReducer from "../features/baomatsubcontentSlice";
import thongtinbosungcontentReducer from "../features/thongtinbosungcontentSlice";
import vedichvucontentReducer from "../features/vedichvucontentSlice";
import vetaptheduccontentReducer from "../features/vetaptheduccontentSlice";
import dvchothueReducer from "../features/dvchothueSlice";
import dvxedienReducer from "../features/dvxedienSlice";
import vedichvusubcontentReducer from "../features/vedichvusubcontentSlice";
import watershowcontentReducer from "../features/watershowcontentSlice";
import quangtruongcontentReducer from "../features/quangtruongcontentSlice";
import giaveReducer from "../features/giaveSlice";
import gioithieucontentReducer from "../features/gioithieucontentSlice";
import gioithieulistReducer from "../features/gioithieulistSlice";

const rootReducer = combineReducers({
    khampha: khamphaReducer,
    watershow: watershowReducer,
    sukienslider: sukiensliderReducer,
    waterfooter: sukienfooterReducer,

    services: lichsuReducer,
    gioithieucontent: gioithieucontentReducer,
    gioithieulist: gioithieulistReducer,
    lichsucontent: lichsucontentReducer,
    thanhviennhahang: thanhviennhahangReducer,
    thanhviencf: thanhviencfReducer,
    thanhviencontent: thanhviencontentReducer,
    baomatcontent: baomatcontentReducer,
    baomatsubcontent: baomatsubcontentReducer,

    quangtruongslider1: quangtruongslider1Reducer,
    quangtruongslider2: quangtruongslider2Reducer,
    quangtruongslider3: quangtruongslider3Reducer,
    quangtruongslider4: quangtruongslider4Reducer,
    quangtruongcontent: quangtruongcontentReducer,
    quangtruong: quangtruongReducer,
    watershowcontent: watershowcontentReducer,

    khiduoidai: khiduoidaiReducer,
    khiduoidaicontent: khiduoidaicontentReducer,

    cachepslider: cachepsliderReducer,
    cachep: cachepfooterReducer,
    cachepcontent: cachepcontentReducer,

    thucvat: thucvatfooterReducer,
    thucvatcard: thucvatcardReducer,
    thucvatcontent: thucvatcontentReducer,

    trangchu: trangchuReducer,

    congviencontent: congviencontentReducer,
    tapthecontent: tapthecontentReducer,
    vedichvucontent: vedichvucontentReducer,
    vedichvusubcontent: vedichvusubcontentReducer,
    vetaptheduccontent: vetaptheduccontentReducer,
    giave: giaveReducer,


    chuy: chuyReducer,
    thongtincanhan: thongtincanhanReducer,
    thongtinbosung: thongtinbosungcontentReducer,
    dvchothue: dvchothueReducer,
    dvxedien: dvxedienReducer,




});

export default rootReducer;
