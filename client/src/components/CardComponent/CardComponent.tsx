import "./CardComponentStyles.scss";
export interface CardComponentProps {
  className?: string;
}
const CardComponent: React.FC<CardComponentProps> = ({
  className,
  children,
}) => {
  return (
    <div className={`card-component__wrapper ${className}`}>{children}</div>
  );
};

export default CardComponent;
