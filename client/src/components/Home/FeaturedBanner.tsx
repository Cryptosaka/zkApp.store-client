import { Avatar, Chip, Image, ScrollShadow } from "@nextui-org/react";
import "../style.css";
import FeaturedCard from "../FeaturedCard";
import { useNavigate } from "react-router-dom";
import routes from "@/routes";
import { useFeaturedZkAppsQuery, useUserImageLazyQuery } from "@/gql/generated";
import { useEffect } from "react";

export default function FeaturedBanner() {
  const navigate = useNavigate();
  const { data } = useFeaturedZkAppsQuery();
  const [fetchUserImage, { data: userImage }] = useUserImageLazyQuery();

  useEffect(() => {
    if (data?.zkApps && data?.zkApps[0]?.owner) {
      fetchUserImage({
        variables: {
          id: data?.zkApps[0]?.owner,
        },
      });
    }
  }, [data]);

  if (!data?.zkApps?.length) {
    return (
      <>
        <h1 className="text-white text-xl">Featured</h1>
        <div className="w-full flex items-center justify-center h-[200px] border-dashed border-2 border-gray-600 rounded-xl">
          <h1 className="text-white">No featured ZkApps</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-white text-xl">Featured</h1>
      </div>
      <div className="flex">
        <div className="flex flex-col md:flex-row banner w-full p-4 gap-28">
          {!!data?.zkApps?.length && (
            <>
              <div className="flex flex-col gap-4 justify-center md:pl-10 min-w-[300px] items-center md:items-start mt-2 md:mt-0">
                <h1 className="md:hidden text-3xl text-white font-bold mb-4 md:mb-0">
                  Highlighted ZkApp
                </h1>
                {data?.zkApps[0]?.category?.slug && (
                  <Chip
                    className="cursor-pointer hover:text-secondary-500 transition-all"
                    size="lg"
                    onClick={() => {
                      console.log("Test");
                      navigate(
                        `${routes.CATEGORY}/${data?.zkApps[0]?.category?.slug}`
                      );
                    }}
                  >
                    #{data?.zkApps[0]?.category?.name || "Uncategorized"}
                  </Chip>
                )}
                <div
                  className="flex flex-row gap-4 md:items-start items-center cursor-pointer hover:bg-[#00000044] transition-all duration-300 p-2 rounded-md"
                  onClick={() =>
                    navigate(`${routes.PRODUCT}/${data?.zkApps[0]?.slug}`)
                  }
                >
                  <Image
                    src={
                      data?.zkApps[0].icon ||
                      `https://picsum.photos/seed/${data?.zkApps[0].slug}/400/400`
                    }
                    className="w-[100px] h-[100px] object-cover"
                  />
                  <div className="h-full flex justify-center flex-col">
                    <h1 className="force-white-text text-xl font-bold">
                      {data?.zkApps[0].name}
                    </h1>
                    <h3 className="force-white-text text-md">
                      {data?.zkApps[0]?.subtitle}
                    </h3>
                  </div>
                </div>
                <Chip
                  className="cursor-pointer hover:text-secondary-500 transition-all"
                  size="lg"
                  startContent={
                    <Avatar
                      size="sm"
                      className="w-[20px] h-[20px]"
                      src={userImage?.user?.profilePicture}
                    />
                  }
                  onClick={() =>
                    navigate(`${routes.PROFILE}/${data?.zkApps[0]?.owner}`)
                  }
                >
                  <p>@{data?.zkApps[0]?.ownerUsername}</p>
                </Chip>
              </div>
            </>
          )}
          <ScrollShadow
            orientation="horizontal"
            className="flex flex-row gap-4 w-full"
          >
            {data?.zkApps
              ?.slice(1, data?.zkApps.length)
              .map((card, index) => (
                <FeaturedCard
                  onClick={() => navigate(`${routes.PRODUCT}/${card?.slug}`)}
                  {...card}
                  white={index % 2 === 0}
                  key={`${index}`}
                />
              ))}
          </ScrollShadow>
        </div>
      </div>
    </>
  );
}
