import clsx from "clsx"
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import EyeIcon from "../../fundamentals/icons/eye-icon"
import EyeOffIcon from "../../fundamentals/icons/eye-off-icon"
import LockIcon from "../../fundamentals/icons/lock-icon"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  key?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  props?: React.HTMLAttributes<HTMLDivElement>
}

const SigninInput = React.forwardRef(
  (
    {
      placeholder,
      name,
      key,
      onChange,
      onFocus,
      className,
      type,
      ...props
    }: InputProps,
    ref
  ) => {
    const inputRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current)

    return (
      <div
        className={clsx(
          "h-[40px] w-[300px] overflow-hidden rounded-rounded border",
          "inter-base-regular bg-grey-5 placeholder:text-grey-40",
          "focus-within:border-violet-60 focus-within:shadow-input",
          "flex items-center",
          {
            "pointer-events-none pl-xsmall text-grey-40 focus-within:border-none focus-within:shadow-none":
              props.readOnly,
          },
          className
        )}
      >
        <input
          className={clsx(
            "remove-number-spinner w-full bg-transparent py-3 px-4 leading-base outline-none outline-0",
            {
              "pl-xsmall": props.readOnly,
            }
          )}
          ref={inputRef}
          name={name}
          key={key || name}
          placeholder={placeholder || "Placeholder"}
          onChange={onChange}
          onFocus={onFocus}
          type={inputType}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 text-grey-40 focus:text-violet-60 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
          </button>
        )}
        {props.readOnly && (
          <LockIcon size={16} className="mr-base text-grey-40" />
        )}
      </div>
    )
  }
)

SigninInput.displayName = "SigninInput"

export default SigninInput
