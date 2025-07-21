export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-10">
      <p>&copy; {new Date().getFullYear()} Recipe Management System by NextReactors</p>
    </footer>
  );
}