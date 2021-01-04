import { createGlobalStyle } from 'styled-components';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #dcdce6;
    color: #FFF;
    -webkit-font-smoothing: antialiased;

    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
  }

  body, input, button, select, option, textarea {
    font-family: 'Roboto Slab', sans-serif;
    font-size: 16px;
  }

  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  h1, h2, h3, h4, strong {
    font-weight: 500;
  }

  button, td {
    cursor: pointer;
  }

  /*CSS editado do Prime para ficar no layout da aplicação
  *-> Accordion
  */
  body .p-accordion .p-accordion-header a {
    padding: 0.571em 1em;
    border: none !important;
    border-top-width: 95%;
    border-top: 4px solid rgb(155, 155, 155);
    color: #333333;
    background-color: transparent !important;
    color: #333333;
    font-weight: 700;
    font-family: 'Roboto Slab', sans-serif;
    font-size: 16px;
    border-radius: 3px;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  body .p-accordion .p-accordion-header a .p-accordion-toggle-icon {
    color: #fff;
    margin-right: 8px;

    &:hover {
      color: #fff;
    }
  }

  .p-accordion .p-accordion-header a>span {
    display: inline-block;
    vertical-align: middle;
    color: #fff;
  }

  body .p-accordion .p-accordion-header:not(.p-disabled).p-highlight:hover a {
    border: none;
    background-color: transparent;
    color: #ffffff;
  }

  body .p-accordion .p-accordion-header:not(.p-disabled) a:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: none;
  }

  /*CSS editado do Prime para ficar no layout da aplicação
   *-> AccordionTab
   */
  body .p-accordion .p-accordion-content {
    padding: 0.571em 1em;
    border: none;
    background-color: transparent;
    color: #333333;
    padding: 0.571em 1em;
    font-family: 'Roboto Slab', sans-serif;
    font-size: 16px;
    border-top: 0;
    border-top: 4px solid rgb(155, 155, 155);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  body .p-multiselect-panel {
    padding: 0;
    border: 1px solid #c8c8c8;
    background-color: #dcdce6;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  }

  body .p-multiselect-panel .p-multiselect-header {
    padding: 0.429em 0.857em 0.429em 0.857em;
    border-bottom: none;
    color: #333333;
    background-color: #dcdce6;
    margin: 0;
  }
`;
