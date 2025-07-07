// eslint-disable-next-line react/prop-types
const Badgde = ({  text, type="neutral" }) => {

    const baseClasses = "px-2 py-1 border-2 rounded-md text-sm font-medium"

    const typeClasses = {
        positive: "text-teal-400 border-teal-400",
        neutral: "text-sky-400 border-sky-400",
        negative: "text-pink-400 border-pink-400",
    }

  return (
    <span className={`${baseClasses} ${typeClasses[type]}`}>
        {text}
    </span>
  )
}

export default Badgde