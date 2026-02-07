export default function Table({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data</div>;
  }

  const keys = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {keys.map(key => (
            <th key={key}>{key.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            {keys.map(key => (
              <td key={key}>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
