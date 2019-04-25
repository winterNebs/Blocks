namespace STYLE {
    export function init() {
        document.head.insertAdjacentHTML("afterend", `
<style>

    * {
        touch-action: manipulation;
    }
    html {
        background-color:#000000;
        color: #EEEEEE;
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
        background-color: #555;
        border: none;
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


</style>`);
    }
}