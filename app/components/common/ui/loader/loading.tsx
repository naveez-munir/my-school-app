interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue-500'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-16 w-16';
      case 'md':
      default: return 'h-12 w-12';
    }
  };

  return (
    <div className="flex justify-center items-center h-64">
      <div className={`animate-spin rounded-full ${getSpinnerSize()} border-t-2 border-b-2 border-${color}`}></div>
    </div>
  );
};

export default LoadingSpinner;
