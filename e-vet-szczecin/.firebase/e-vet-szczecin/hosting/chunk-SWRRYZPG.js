import{a as N,b as c,c as I,d as T,e as V,f as k,g as q,h as G,i as R}from"./chunk-KDY3UDH4.js";import{C as d,D as C,F as h,G as v,I as p,K as S,O as i,P as t,Q as u,R as w,T as L,U as s,X as D,Y as r,Z as y,ia as E,j as m,l as f,m as b,pa as F,s as _,sa as j,ta as z,v as a,y as x}from"./chunk-H22KX6EP.js";import"./chunk-ECBXVGWK.js";var P=()=>[V,N,I,T,k,q];function A(e,o){if(e&1&&(i(0,"span",12),r(1),t()),e&2){let n=s(2);a(),y(n.logger.error())}}function B(e,o){e&1&&(i(0,"span",13),r(1,"Nothing"),t())}function H(e,o){if(e&1){let n=w();i(0,"section",2)(1,"form",3,0),L("ngSubmit",function(){f(n);let M=s();return b(M.onSubmit())}),i(3,"h3",4),r(4,"Zaloguj si\u0119"),t(),i(5,"div",5)(6,"label",6),r(7,"Email address"),t(),u(8,"input",7),t(),i(9,"div",8)(10,"label",9),r(11,"Password"),t(),u(12,"input",10),t(),i(13,"button",11),r(14," Login "),t(),d(15,A,2,1,"span",12)(16,B,2,0,"span",13),t()()}if(e&2){let n=D(2),l=s();a(),p("formGroup",l.loginForm),a(12),p("disabled",l.logger.isLoading()),a(2),S(l.logger.error()&&n.submitted?15:16)}}function W(e,o){e&1&&(i(0,"div",14)(1,"div",15)(2,"span",13),r(3,"Loading..."),t()()())}var g=class e{authService=m(z);router=m(F);fb=m(G);login=_(null);logger=j({request:()=>this.login(),loader:o=>this.authService.login(o.request)});loginForm=this.fb.nonNullable.group({email:["grzegorzkolaty@gmail.com",c.required],password:["Poszkole1",c.required]});constructor(){E(()=>{!!this.authService.user()&&this.router.navigate(["auth","profile"])})}onSubmit(){let o=this.loginForm.getRawValue();this.loginForm.valid&&this.login.set(o)}static \u0275fac=function(n){return new(n||e)};static \u0275cmp=x({type:e,selectors:[["app-login"]],decls:4,vars:1,consts:[["form","ngForm"],[500,null],[1,"catbackground","p-5"],[1,"mx-auto","col-xl-4","p-lg-5","p-4","rounded","glass__form","fw-semibold",3,"ngSubmit","formGroup"],[1,"mb-3","text-center","fw-bold"],[1,"mb-4"],["for","emailInput",1,"form-label"],["formControlName","email","placeholder","email","type","email","id","emailInput","aria-describedby","emailHelp",1,"form-control","form-control-lg"],[1,"mb-3"],["for","passwordInput",1,"form-label"],["formControlName","password","type","password","id","passwordInput","placeholder","password",1,"form-control","form-control-lg"],["type","submit",1,"btn","btn-lg","btn-dark","w-100","mb-3",3,"disabled"],[1,"text-danger"],[1,"visually-hidden"],[1,"d-flex","justify-content-center","m-5"],["role","status",1,"spinner-border"]],template:function(n,l){n&1&&(d(0,H,17,3)(1,W,4,0),h(2,0,P,1,null,null,1,null,C)),n&2&&(a(2),v(!l.logger.value()))},dependencies:[R],encapsulation:2,changeDetection:0})};export{g as default};
