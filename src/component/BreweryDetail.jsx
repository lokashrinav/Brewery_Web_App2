import React from 'react';
import { useParams } from 'react-router-dom';

function BreweryDetail({ data }) {
  const { breweryId } = useParams();

  let brewery = null;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id.toString() === breweryId) {
      brewery = data[i];
      break; // Exit the loop once the brewery is found
    }
  }
  
  return (
    <div>
      <h3>Name: {brewery.name}</h3>
      <p>Brewery Type: {brewery.brewery_type}</p>
      <p>Location: {brewery.city}, {brewery.state_province}</p>
      <p>Address: {brewery.address_1}, {brewery.address_2}, {brewery.address_3}</p>
      <p>Postal Code: {brewery.postal_code}</p>
      <p>Country: {brewery.country}</p>
      <p>Phone: {brewery.phone}</p>
      <p>Website: <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a></p>
    </div>
  );
}

export default BreweryDetail;