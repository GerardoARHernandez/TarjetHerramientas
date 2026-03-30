// components/ui/Text.jsx
const Text = ({ children, variant = 'body', className = '' }) => {
  const variants = {
    title: 'text-lg font-semibold text-gray-900 dark:text-white',
    body: 'text-gray-600 dark:text-gray-300',
    small: 'text-sm text-gray-500 dark:text-gray-400',
  };

  return (
    <p className={`${variants[variant]} ${className}`}>
      {children}
    </p>
  );
};

// Uso en componentes
// import Card from './ui/Card';
// import Text from './ui/Text';

// const NuevoComponente = () => {
//   return (
//     <Card>
//       <Text variant="title">Título de la tarjeta</Text>
//       <Text variant="body">Contenido de la tarjeta</Text>
//       <Text variant="small">Nota al pie</Text>
//     </Card>
//   );
// };