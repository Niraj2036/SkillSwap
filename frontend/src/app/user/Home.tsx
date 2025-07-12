import OuterNavbar from "@/components/outer_navbar";

const Home = () => {
  return (
    <div>
      <OuterNavbar />

      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1>Welcome to SkillSwap!</h1>
      </div>
    </div>
  );
};

export default Home;
