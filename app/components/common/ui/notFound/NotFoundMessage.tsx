interface NotFoundMessageProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const NotFoundMessage: React.FC<NotFoundMessageProps> = ({
  title = 'Item not found',
  buttonText = 'Back to list',
  onButtonClick,
  className = ''
}) => {
  return (
    <div className={`text-center py-10 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {onButtonClick && (
        <div className="mt-4">
          <button 
            onClick={onButtonClick}
            className="text-blue-600 hover:text-blue-800"
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotFoundMessage;
