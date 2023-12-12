import { data, columns } from "./data";
import { Table } from "./components/Table";

const App = () => {
  return (
    <div className="app stack">
      <h1 align="center">Table Sticky Columns</h1>
      <p>
        Name and Email columns are sticky by default. Scroll to table right to
        see them stacked on the left.
      </p>
      <p>Check on the checkboxes to pin them to left</p>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default App;
