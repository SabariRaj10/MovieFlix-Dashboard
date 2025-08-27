import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

const GenrePieChart = ({ movies }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (movies && movies.length > 0) {
      prepareChartData();
    }
  }, [movies]);

  const prepareChartData = () => {
    // Genre Distribution (Pie Chart)
    const genreCounts = {};
    movies.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre)) {
        movie.genre.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    const chartData = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 genres

    setChartData(chartData);
  };

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  // Use the actual movie count, not the sum of genre counts
  const total = movies.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
        Genres Distribution
      </h3>
      
      {chartData.length > 0 ? (
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Pie Chart Visualization */}
          <div className="relative w-64 h-64">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {chartData.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const startAngle = chartData
                  .slice(0, index)
                  .reduce((sum, prevItem) => sum + (prevItem.count / total) * 360, 0);
                const endAngle = startAngle + (item.count / total) * 360;
                
                // Convert angles to radians and calculate coordinates
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                // Determine if arc is large
                const largeArcFlag = percentage > 50 ? 1 : 0;
                
                // Create path for pie slice
                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={colors[index % colors.length]}
                    stroke="#fff"
                    strokeWidth="0.5"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </svg>
            
                         {/* Center text */}
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center">
                 <div className="text-2xl font-bold text-gray-700 dark:text-black">
                   {total}
                 </div>
                 <div className="text-sm text-gray-500 dark:text-black">
                   Total Movies
                 </div>
               </div>
             </div>
          </div>

          {/* Legend */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.genre}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({((item.count / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No genre data available</p>
        </div>
      )}
    </div>
  );
};

export default GenrePieChart;
