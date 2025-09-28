"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./header.module.css";
import { GrTechnology } from "react-icons/gr";
import { MdClose, MdMenu } from "react-icons/md";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Smart
        <GrTechnology />
        School
      </Link>

      <div className={styles.menu}>
        {toggle ? (
          <MdClose
            onClick={() => {
              setToggle((prev) => !prev);
            }}
          />
        ) : (
          <MdMenu
            onClick={() => {
              setToggle((prev) => !prev);
            }}
          />
        )}
      </div>

      <div
        className={styles.navlinkWrapper}
        style={{
          clipPath:
            (toggle && "polygon(0 0, 100% 0, 100% 100%, 0% 100%)") || "",
        }}
      >
        <ul className={styles.navlinks}>
          <Link onClick={()=> setToggle(false)} className={styles.navlink} href="/">
            {" "}
            Home{" "}
          </Link>
          <Link onClick={()=> setToggle(false)} className={styles.navlink} href="/admin">
            {" "}
            Admin
          </Link>
          <Link onClick={()=> setToggle(false)} className={styles.navlink} href="/about">
            {" "}
            about
          </Link>
          <Link onClick={()=> setToggle(false)} className={styles.navlink} href="/search">
            {" "}
            search
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
