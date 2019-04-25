namespace STYLE {
    export function init() {
        document.head.insertAdjacentHTML("afterend", `
<style>

    * {
        touch-action: manipulation;
    }
    html {
        background-color:#000000;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
    }

    a:link {
      color: #ea2347;
    }

    a:visited {
      color: #ea2347;
    }

    a:hover {
      color: hotpink;
    }

    a:active {
      color: blue;
    }

    input {
        background-color: #333333;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        padding-left: 5px;
        border: 1px solid #DDDDDD;
    }
    input[type=number]{
        background-color: #333333;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        padding-left: 5px;
        width: 5rem;
        border: 1px solid #DDDDDD;
    }
    tr {
        margin: 0px;
        padding: 0px;
        border: 0px;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    input[type=range] {
  -webkit-appearance: none;
  width: 60%;
  margin: 0.2px 0;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 60%;
  height: 25.6px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #333333;
  border-radius: 0px;
  border: 0px solid #010101;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #ffffff, 0px 0px 0px #ffffff;
  border: 0px solid #fffffa;
  height: 26px;
  width: 26px;
  border-radius: 0px;
  background: #999999;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -0.2px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #717171;
}
input[type=range]::-moz-range-track {
  width: 60%;
  height: 25.6px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #4d4d4d;
  border-radius: 0px;
  border: 0px solid #010101;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #ffffff, 0px 0px 0px #ffffff;
  border: 0px solid #fffffa;
  height: 26px;
  width: 26px;
  border-radius: 0px;
  background: #999999;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 60%;
  height: 25.6px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #292929;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type=range]::-ms-fill-upper {
  background: #4d4d4d;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type=range]::-ms-thumb {
  box-shadow: 0px 0px 0px #ffffff, 0px 0px 0px #ffffff;
  border: 0px solid #fffffa;
  height: 26px;
  width: 26px;
  border-radius: 0px;
  background: #999999;
  cursor: pointer;
  height: 25.6px;
}
input[type=range]:focus::-ms-fill-lower {
  background: #4d4d4d;
}
input[type=range]:focus::-ms-fill-upper {
  background: #717171;
}
    select {
        border: 0;
        background: #333333;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        font:
    }
    button {
background-color: #4CAF50; /* Green */
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        border: 1px solid #DDDDDD;
        background: #333333;
}

</style>`);
    }
}