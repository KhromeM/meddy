export const barChartData = [
  {
    name: "Sales",
    data: [330, 250, 110, 300, 490, 350, 270, 130, 425],
  },
];

export const barChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      backgroundColor: "red",
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        backgroundColor: "red",
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    show: false,
    labels: {
      show: false,
      style: {
        colors: "#fff",
        fontSize: "12px",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    color: "#fff",
    labels: {
      show: true,
      style: {
        colors: "#fff",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
  },
  fill: {
    colors: "#fff",
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: "12px",
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
      },
    },
  ],
};

export const lineChartData = [
  {
    name: "Sleep Time",
    data: [7, 6.5, 8, 7.5, 6, 7, 8, 7.5, 7],
  },
  {
    name: "Steps",
    data: [5000, 7000, 8000, 7500, 6000, 9000, 10000, 8500, 9500],
  },
  {
    name: "Heart Rate",
    data: [60, 62, 65, 70, 68, 72, 75, 78, 80],
  },
];

// export const lineChartOptions = {
//   chart: {
//     toolbar: {
//       show: false,
//     },
//   },
//   tooltip: {
//     theme: "dark",
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   stroke: {
//     curve: "smooth",
//   },
//   xaxis: {
//     type: "datetime",
//     categories: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     labels: {
//       style: {
//         colors: "#c8cfca",
//         fontSize: "12px",
//       },
//     },
//   },
//   // yaxis: {
//   //   labels: {
//   //     style: {
//   //       colors: "#c8cfca",
//   //       fontSize: "12px",
//   //     },
//   //   },
//   // },
//   yaxis: [
//     {
//       seriesName: "Sleep Time",
//       axisTicks: {
//         show: true,
//       },
//       axisBorder: {
//         show: true,
//         color: "#4FD1C5",
//       },
//       labels: {
//         style: {
//           colors: "#4FD1C5",
//           fontSize: "12px",
//         },
//       },
//       title: {
//         text: "Sleep Time",
//         style: {
//           color: "#4FD1C5",
//         },
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     {
//       seriesName: "Steps",
//       opposite: true,
//       axisTicks: {
//         show: true,
//       },
//       axisBorder: {
//         show: true,
//         color: "#2D3748",
//       },
//       labels: {
//         style: {
//           colors: "#2D3748",
//           fontSize: "12px",
//         },
//       },
//       title: {
//         text: "Steps",
//         style: {
//           color: "#2D3748",
//         },
//       },
//     },
//     {
//       seriesName: "Heart Rate",
//       opposite: true,
//       axisTicks: {
//         show: true,
//       },
//       axisBorder: {
//         show: true,
//         color: "#FF6347",
//       },
//       labels: {
//         style: {
//           colors: "#FF6347",
//           fontSize: "12px",
//         },
//       },
//       title: {
//         text: "Heart Rate",
//         style: {
//           color: "#FF6347",
//         },
//       },
//     },
//   ],
//   legend: {
//     show: true,
//   },
//   grid: {
//     strokeDashArray: 5,
//   },
//   fill: {
//     type: "gradient",
//     gradient: {
//       shade: "light",
//       type: "vertical",
//       shadeIntensity: 0.5,
//       gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
//       inverseColors: true,
//       opacityFrom: 0.8,
//       opacityTo: 0,
//       stops: [],
//     },
//     colors: ["#4FD1C5", "#2D3748", "#FF6347"],
//   },
//   colors: ["#4FD1C5", "#2D3748", "#FF6347"],
// };

export const lineChartOptions = {
  chart: {
    name: "Biomarker Stats",
    toolbar: {
      show: false,
    },
    margin: {
      left: 0, // Adjust margin to shift the graph left
      right: 0,
    },
    background:
      "linear-gradient(90deg, rgba(255,0,150,0.1) 0%, rgba(0,204,255,0.1) 100%)", // Add background gradient
    borderRadius: 10, // Add border radius
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  tooltip: {
    enabled: true,
    fixed: {
      enabled: true,
      position: "topLeft", // Position the tooltip at the top left
      offsetX: 220,
      offsetY: -75,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    type: "datetime",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "13px",
      },
    },
  },
  yaxis: [
    {
      seriesName: "Sleep Time",
      min: 5,
      max: 9,
      axisTicks: {
        // show: true,
      },
      axisBorder: {
        show: true,
        color: "#4FD1C5",
        offsetX: -7,
      },
      labels: {
        style: {
          colors: "#4FD1C5",
          fontSize: "7px",
        },
        offsetX: -50, // Adjust horizontal offset to reduce space
      },
      title: {
        text: "Sleep Time",
        style: {
          color: "#4FD1C5",
        },
        offsetX: 2,
      },
    },
    {
      seriesName: "Steps",
      // opposite: true,
      min: 4000,
      max: 11000,
      axisTicks: {
        // show: true,
      },
      axisBorder: {
        show: true,
        color: "#2D3748",
        offsetX: -7,
      },
      labels: {
        style: {
          colors: "#2D3748",
          fontSize: "7px",
        },
        offsetX: -35, // Adjust horizontal offset to reduce space
        // offsetY: 0
      },
      title: {
        text: "Steps",
        style: {
          color: "#2D3748",
        },
        offsetX: 2,
      },
    },
    {
      seriesName: "Heart Rate",
      // opposite: true,
      min: 50,
      max: 90,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: "#FF6347",
        offsetX: -7,
      },
      labels: {
        style: {
          colors: "#FF6347",
          fontSize: "7px",
        },
        offsetX: -20, // Adjust horizontal offset to reduce space
      },
      title: {
        text: "Heart Rate",
        style: {
          color: "#FF6347",
        },
        // offsetX: -10,
      },
    },
  ],
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 5,
    padding: {
      left: -40, // Adjust padding to shift the graph left
      right: 0,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      inverseColors: true,
      opacityFrom: 0.8,
      opacityTo: 0,
      stops: [],
    },
    colors: ["#4FD1C5", "#2D3748", "#FF6347"],
  },
  colors: ["#4FD1C5", "#2D3748", "#FF6347"],
};
