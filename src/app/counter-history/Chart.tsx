'use client';

import React from 'react';
import { VegaLite } from 'react-vega';


const Chart = ({ data }: { data: any[] }) => {
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Monthly counter",
    //"width": 600,
    "height": 400,
    "data": {
      "values": data
    },
    "transform": [
      {
        "calculate": "timeParse(datum.month, '%Y-%m')",
        "as": "date"
      }
    ],
    "mark": {
      "type": "bar",
      "tooltip": true
    },
    "encoding": {
      "x": {
        "field": "date",
        "type": "temporal",
        "timeUnit": "yearmonth",
        "title": "Month",
        "axis": {
          "format": "%b %Y"
        },
      },
      "y": {
        "field": "count",
        "type": "quantitative",
        "title": "Resource usage (count)"
      },
      "tooltip": [
        { "field": "month", "type": "nominal", "title": "Month" },
        { "field": "count", "type": "quantitative", "title": "count" }
      ]
    }
  }
    ;

  return <VegaLite spec={spec} />;
};

export default Chart;
